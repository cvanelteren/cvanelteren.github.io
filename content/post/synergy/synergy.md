
# Table of Contents

1.  [What is synergy?](#org1360f1e)

The real-world is a complex place. Scientists aim to explain
real-world phenomena by means of a simplified representation
of reality. In  this process they tend to focus  on parts of
reality that  are most correlated with  the observation from
this phenomenon.

Most of these models  contain multiple factors. For example,
the  infection rate  of  covid can  be  related the  general
health  of the  population,  age, mobility  rate, amount  of
social gatherings  etc. Similarly,  ones voting  behavior is
some  outcome  of  the   moral  compass  of  an  individual,
socio-economic developments and other environmental factors.
Modelers make choices what factors  to include (and which to
ignore) but (generally) all models of the real-world consist
of  at least 2 or more factors,  and more  importantly these
factors  often  interact   (non-trivially).

Multivariate  interactions  are   notoriously  difficult  to
analyze  as  the combinations  that  can  occur between  the
variables explode.  This point can readily  be understood by
combinatorics. Consider a  set of $N$ variables  and all the
three  way  interactions that  can  occur  within this  set.
Ignoring the order  of the factors, we readily  see that for
$N=3$  there is  only  one such  grouping,  but this  scales
non-linearly with $N$:

$$\binom{N}{3} = \frac{N(N-1)(N-2)}{3!}.$$
There is a commonly held assumption that the dependencies in
a system can  generally be compressed such  that in practice
the non-linearly scaling does not occur in practice.


<a id="org1360f1e"></a>

# What is synergy?

