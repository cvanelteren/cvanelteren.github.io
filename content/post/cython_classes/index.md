---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Creating the fastest chicken alive!"
subtitle: "Wrapping cpp in cython and python"
summary: "Wrapping cpp in cython and python" 
authors: []
tags: [coding, cython, cpp, chickens]
categories: []
date: 2021-06-23T20:59:18+02:00
lastmod: 2021-06-23T20:59:18+02:00
featured: true
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

Python is my preferred language due to its ease of use, general application, interactivity, and availibility of libraries. There is however one big downside: python can be painfully slow for numerical applications. One possible solution is to write extensions in lower-level languages and provide bindings that one can use from python. This is often referred to as the two-language-problem as it requires a programmer to know two languages. In this post I will explore `cython` which is "half" language that allows to write both native python and c/cpp in one file. In particular, I will focus on binding cpp classes to python to extend python libraries to python.

# Cython
In a nutshell, cython allows a programmer to write python-like code that is then compiled into c/cpp. This can be used to write high performant extensions. The goal of this post is not to provide a novice tutorial; for those interested cython's documentation provides some great material for that. This post will focus mainly on providing bindings of cpp to python.

## CPP class
Imagine we want to write an extremely fast chicken, and we have decided python is not suitable for this. We turn to cpp and write something like

```c++
// file: chicken.hpp
#ifndef chicken_hpp
#define chicken_hpp
#include <iostream>
class Chicken {
public:
  Chicken();
  Chicken(std::string name);
  std::string name;
  void peck();
};
#endif
```

We start implementing straight away and end up with something like:

```c++
// file: chicken.cpp
#include "chicken.hpp"

Chicken::Chicken() { this->name = "HELP I HAVE NO NAME"; }
Chicken::Chicken(std::string name) { this->name = name; }
void Chicken::peck() { std::cout << "Peck peck!" << std::endl; }
```

Our chicken is alive, but it is stuck in cpp world. We have to get it running in python. How do we start doing this? In order to order to create a python chicken class, we have to provide a wrapper. In cython, we achieve this in two steps. First, we need to tell cython what cpp object we are looking at. Second, we need to create a cython extenions that provides bindings for python. 

## Cython header
Just like in cpp, cython has a header/implementation style system. The headers are kept in `pxd` files and the implementation are in `pyx` files. For our headers, we merely have to provide implementations on our cpp class methods. Cython offers three kinds; standard python `def` implementations, `cpdef`, and `cdef` methods. The last two are special kinds; `cpdef` methods allow for seamless interaction between "python-world" and "cpp-world". In contrast, `cdef` methods only allow for interaction with cpp objects. For this current tutorial, this distinction is not necessary, and we can go straight ahead with implementing our chicken.

We need to tell cython what our cpp class looks like. We create a header file `cychicken.pxd` with the following content

```python
#file cychicken.pxd
from libcpp.string cimport string

cdef extern from "chicken.hpp":
    cdef cppclass Chicken:
        Chicken() except+
        Chicken(string name) except+
        string name
        void peck()
```

The first line imports the cython implementation of string (which is merely a wrapper for `std::string`), `cdef extern` is similar to `extern` in c/cpp: it tells cython that there is an external header. We then "color in" the header and tell cython what objects life in this header. In our case, we have a chicken! And importantly, this chicken has a `name` and it can `peck` (be careful!).

## Cython implementation
We now have  implemented our class in cpp and defined headers for the class in cpp and cython. At this point, we could `cimport` the `Chicken` class and within `cdef` and `cpdef` classes can interact with this cpp class. However, we cannot yet import our chicken class into python directly. In order to do this, we have to provide an implementation (wrapper) for the python side to interact with.


```python
#file: cychicken.pyx
from cychicken cimport Chicken, string
cdef class PyChicken:
    # defines class property
    # can be put into pxd files
    cdef Chicken *cpp_chicken

    # normal class init
    def __init__(self, name: str):
        # need to convert string to binary
        # for cpp strings
        self.cpp_chicken = new Chicken(f"{name}".encode('utf8'))

    # ensures that point is deleted when object is
    # destroyed
    def __dealloc__(self):
        del self.cpp_chicken

    # wrap the peck function
    def peck(self):
        self.cpp_chicken.peck()

    # wrap the name property
    @property
    def name(self):
        return self.cpp_chicken.name.decode('utf8')

```

Our chicken can now freely be called  from python!

## Compiling
Before we can test our chicken, we have to write some code to compile it into a shared object. Setting up a proper extension is some black magic in and of itself. I won't bore you with the details today and for now you can merely create a setup file as such

```python
#file: setup.py
from setuptools import setup
from Cython.Build import cythonize
from setuptools.extension import Extension

exts = [
    Extension(
        "chicken",
        sources=["cychicken.pyx", "chicken.cpp"],
        include_dirs=["."],
        language="c++",
    )
]

setup(ext_modules=cythonize(exts))

```

Running `python setup.py build_ext --inplace` will compile and create a shared object file inplace with the name `chicken.cpython-39-x86_64-linux-gnu.so`. We can now finally test our chicken:

```python
# file: test_chicken.py
from chicken import PyChicken

chicken = PyChicken("Carl")
# cdef Chicken chicken = Chicken(string("CARL"))
print(f"My name is {chicken.name}")
for i in range(10):
    chicken.peck()


```

Which outputs:
```
My name is Carl
Peck peck!
Peck peck!
Peck peck!
Peck peck!
Peck peck!
Peck peck!
Peck peck!
Peck peck!
Peck peck!
Peck peck!
```

Carl is now the fastest chicken that can be called from python. 


## Outlook
I hope you find this little tutorial helpful. I hope to continue some explorations in the future. Cython can produce highly performant code. However, providing the bindings requires a lot of boiler-plate code. In the future I will look at another great alternative to provide python wrappers. In particular, I will focus on `nimpy` and `pybind11`. See you in the next post!






