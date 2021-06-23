from libcpp.string cimport string
from cython.operator cimport dereference as deref

cdef extern from "chicken.hpp":
    cdef cppclass Chicken:
        Chicken() except+
        Chicken(string name) except+
        string name
        void peck()
        string get_name()
        void print_name()


