/*
 
Python module to compute the permutation complexity and entropy measures by Rosso et al, 2008. Written by Nicolas Brodu <nicolas.brodu@inria.fr>, free software with the Cecill-C licence (compatible with LGPL v3 or more recent).

Compile with : g++ -O3 -Wall -shared -std=c++11 -fPIC -I./pybind11 -I /usr/include/python3.7 hcpermut.cpp -o hcpermut.so

Then load the module (once the .so is in your PYTHONPATH) from Python.

Example
=======

import numpy as np
import hcpermut
import matplotlib.pyplot as plt

# data is one series per column, samples on each line
data = np.loadtxt("some_data.txt")

# compute the admissible domain for values of entropy and complexity
hrange = np.linspace(0,1,101)
cminmax = hcpermut.cminmax(hrange)

plt.figure()
plt.plot(hrange, cminmax[:,0], 'k', hrange, cminmax[:,1], 'k')

# compute the permutation entropy and complexity of the data
hc = hcpermut.hc(data)

# display one point of coordinates (entropy, complexity) per series
plt.scatter(hc[:,0], hc[:,1], color='b')

plt.show()


Full documentation
==================

cminmax = hcpermut.cminmax(hrange, order)
    Parameters:
    - hrange: is a 1-dimensional array of permutation entropy values (normalized between 0 and 1) at which to compute the minimum and maximum complexity values
    - order (optional): is the permutation order. Defaults to 7. Warning: there are order! permutation, so increase the order only if you have enough data to maintain good statistics. Lowering the order may be necessary for small data sets, but then, the quality of the results also decreases.
    Output:
    - cminmax : a numpy array with as many rows as values h in hrange, and two columns : the minimum and maximum complexity values for each h.

hc = hcpermut.hc(data, order, subsampling)
    Parameters:
    - data: is a numpy array with as many columns as time series, and one row per sample
    - order (optional): same as above
    - subsampling (optional): if set, the data is subsampled with the given spacing before computing the entropy and complexity values. The permutations frequencies are aggregated over each data shift 0...subsampling-1. Defaults to 1 (no subsampling)
    Output:
    - hc: a numpy array with as many lines as series and two columns : the entropy and the complexity values for each series.

*/


#include <map>
#include <limits>

#include <stdint.h>
#include <math.h>

#include <iostream>

#include "pybind11/pybind11.h"
#include "pybind11/numpy.h"

namespace py = pybind11;
using namespace std;

template<typename values_getter>
static uint64_t permindex(uint64_t* factbase, int order, values_getter get, int s, int index, int subsampling) {
    uint64_t perm = 0;
    int taken[order];
    for (int i=0; i<order; ++i) taken[i] = 0;
    for (int j=order-1; j>=0; --j) {
        int idx = -1, minidx = 0, mint = 0;
        double minsofar = std::numeric_limits<double>::max();
        for (int i=0; i<order; ++i) if (!taken[i]) {
            ++idx;
            double value = get(s, index + i*subsampling);
            if (value<=minsofar) {
                minidx = idx;
                mint = i;
                minsofar = value;
            }
        }
        taken[mint] = 1;
        perm += minidx * factbase[j];
    }
    return perm;
}

py::array_t<double> hc(py::array_t<double> series, int order, int subsampling) {
    
    auto info = series.request();

    if (info.ndim > 2) throw std::runtime_error("Number of dimensions must be <=2");
    
    int nvalues = info.shape[0];
    int nseries = info.ndim==1 ? 1 : info.shape[1];
    
    auto result = py::array(py::buffer_info(
        nullptr,            // Pointer to data (nullptr -> ask NumPy to allocate!)
        sizeof(double),     // Size of one item
        py::format_descriptor<double>::value, // Buffer format
        2,                  // How many dimensions?
        { nseries, 2},      // Number of elements for each dimension
        { sizeof(double),  nseries*sizeof(double) }  // Strides, column-major
    ));
    
    auto info_result = result.request();
    
    uint64_t *factbase = new uint64_t[order];
    factbase[0] = 1;
    for (int i=1; i<order; ++i) factbase[i] = factbase[i-1] * i;
    uint64_t N = factbase[order-1]*order;
    
    double onedivN = 1.0/N;
    double log2N = log2((double)N);
    double normH = 1.0/log2N;
    double normQ = 1./(-0.5*((1.+1./N)*log2(1.+N)-2.*log2(2.*N)+log2((double)N)));
    double null_Qproba = log2(0.5/N) * 0.5/N;
    
    int datastride0 = info.strides[0];
    int datastride1 = info.ndim==1 ? 1 : info.strides[1];
    auto getval = [&](int s, int idx) -> double {
        // original data is (nvalues, nseries) => stride 0 is for values, 1 for series
        return *(double*)((char*)(info.ptr) + datastride0 * idx + datastride1 * s );
    };
    
    for (int s=0; s<nseries; ++s) {
    
        // could be optimised for small orders into a plain array...
        // ...but this is much faster for large orders with lots of missing permutations
        std::map<uint64_t, double> pdist;
        // process all shifts in subsampling, so can increase i one by one
        // idx0 = i
        // idx1 = i + subsampling
        // idx_order-1 = i + subsampling * (order-1)
        // must have: i + subsampling * (order-1) < nvalues
        int nperms = nvalues - subsampling * (order-1);
        for (int i=0; i<nperms; ++i) {
            using namespace std;
            ++pdist[permindex(factbase,order,getval,s,i,subsampling)];
        }
        
        double entropy = 0;
        double Q = 0;
        int num_non_null = 0;
        for (std::map<uint64_t,double>::iterator it = pdist.begin(); it!=pdist.end(); ++it) {
            it->second /= nperms; // finish frequency computation
            double p = it->second;
            entropy -= p * log2(p);
            double pq = ( p + onedivN) * 0.5;
            Q -= pq * log2(pq);
            ++num_non_null;
        }
        // map is ordered, add missing values each with 0 proba => p2 = 1/(2N)
        Q -= null_Qproba * (N-num_non_null);
        Q -= (entropy + log2N) * 0.5;
        Q *= normQ;
        double H = entropy * normH;
        double C = Q * H;
        
        static_cast<double*>(info_result.ptr)[s] = H;
        static_cast<double*>(info_result.ptr)[s+nseries] = C;
    }
    
    delete[] factbase;
    
    return result;
}


py::array_t<double> cminmax(py::array_t<double> hvalues, int order) {
    
    auto plogp = [](double x) {
        return x<=0. ? 0. : (x>=1. ? 0. : x*log(x));
    };
    
    auto info = hvalues.request();

    if (info.ndim != 1) throw std::runtime_error("Number of dimensions must be 1");
    
    int nh = info.shape[0];
    
    auto result = py::array(py::buffer_info(
        nullptr,            // Pointer to data (nullptr -> ask NumPy to allocate!)
        sizeof(double),     // Size of one item
        py::format_descriptor<double>::value, // Buffer format
        2,                  // How many dimensions?
        { nh, 2},           // Number of elements for each dimension
        { sizeof(double), nh * sizeof(double) }  // Strides for each dimension
    ));
    
    auto info_result = result.request();
    
    // order!
    double kf = 1;
    for (int i=2; i<=order; ++i) kf *= i;
    double logkf = log(kf);
    double logkfm1 = log(kf-1.);
    double normq = 1. / (-0.5*((1.+1./kf)*log(1.+kf)-2.*log(2.*kf)+logkf));
    
    auto getval = [&](int h) -> double {
        return *(double*)((char*)(info.ptr) + info.strides[0] * h);
    };
    
    for (int ih=0; ih<nh; ++ih) {
        double h = getval(ih);

        double plow=0, phigh=1, pmid=0.5;
        // strictly decreasing function
        double target = h*logkf;
        while (phigh-plow>1e-6) {
            pmid = 0.5 * (phigh+plow);
            double fmid = -plogp(pmid)-plogp(1.-pmid)+(1.-pmid)*logkfm1;
            if (fmid<target) {phigh=pmid; continue;}
            if (fmid>target) {plow=pmid; continue;}
            break;
        }
        double qmin = (-((pmid+1./kf)*0.5)*log((pmid+1./kf)*0.5)+0.5*plogp(pmid)-(kf-1)*((((1-pmid)/(kf-1.))+1./kf)*0.5)*log((((1-pmid)/(kf-1.))+1./kf)*0.5)+0.5*(1-pmid)*log((1-pmid)/(kf-1.))-0.5*log(kf)) * normq;
        
        // r=kf - m - 1 with m null components, only one component with proba p
        // q = (1-p) / r
        // h*logkf = -p*log(p) - sum_r (1-p)/r * log((1-p)/r) - m*0
        // h*logkf = -p*log(p) - (1-p) * log((1-p)/r)
        // h*logkf = -p*log(p) - (1-p)*log(1-p) + (1-p)log(kf - m - 1)
        
        double qmax = 0;
        for (int pdisc = 1; pdisc<1000; ++pdisc) {
            double p = pdisc / 1000;
            double m = kf - 1 - exp((h*logkf + plogp(p) + plogp(1.-p))/(1.-p));
            if (m<0 || m>=kf-1) continue;
            // for the lone component
            double pq = (p + 1./kf) * 0.5;
            double Q = -plogp(pq);
            // the constant components
            pq = ((1.-p) / (kf - m - 1) + 1./kf) * 0.5;
            Q -= (kf - m - 1) * plogp(pq);
            // the null components
            pq = 0.5 / kf;
            Q -= m * plogp(pq);
            Q -= (h*logkf +logkf)*0.5;
            qmax = max(qmax, Q*normq);
        }
        
        static_cast<double*>(info_result.ptr)[ih] = max(0.,h*qmin);
        static_cast<double*>(info_result.ptr)[ih+nh] = max(0.,h*qmax);

    }
    
    return result;
}


PYBIND11_MODULE(hcpermut, m) {
    m.doc() = "permutation entropy and complexity module"; // optional module docstring
    m.def("hc", &hc, "Computes the permutation entropy and complexity of one or more series. Returns the entropy and the complexity for each value", py::arg("series"), py::arg("order") = 7, py::arg("subsampling") = 1);
    m.def("cminmax", &cminmax, "Computes the bounds for the entropy and complexity of for a given permutation order and for the given set of entropy values between 0 and 1. Returns the complexity min and max for each of the provided entropy value", py::arg("hvalues"), py::arg("order") = 7);
}
