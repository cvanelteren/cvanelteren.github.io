
# Table of Contents

1.  [What are templates?](#org62422b7)
    1.  [Templates in Cython](#org4170cb6)
2.  [Let&rsquo;s get freaky](#orgc1a22ba)
3.  [Summary](#orgad3284d)

Cython offers to write  high performing (compiled) code with
python  and C++/C  side-by-side.  For  a python  programmer,
cython  can  be  used   to  replace  functions  with  c-like
functions.  The   cython  documentation  shows   some  clear
examples on how a python program could be transformed into a
statically compiled program. The  docs also highlight how to
provide templated code. For  simple templates this is clear,
but I found that some code is more difficult to template.

This  short  article  may  form as  a  guided  tour  towards
binding templated code to cython.


<a id="org62422b7"></a>

# What are templates?

Python is an interpreted language. This means that when code
is run, the  interpreted converts the code  to byte compiled
code. It goes through the code line for line and converts it
&ldquo;on the  fly&rdquo; to something  the computer can  understand. In
contrast, C/C++  are compiled languages. Prior  to execution
of the program a compiler  translates the code into a binary
that  the machine  can  understand. After  which the  binary
can be executed.  Due to the statically  defined nature, C++
needs  to deal  with shared  code that  can act  on multiple
types.  One  way  to   achieve  this  is  through  *function
overloading*; functions  with the same name  are written but
different input (types) such  that calling the function with
different types will execute the correct function associated
with those  inputs. This, however becomes  quite tedious and
obsolete when considering templates.

    // in C++ types need to be considered.
    // Some have implicit casting from one type to another,
    // In general it is better to be more exact.
    int return_square(int x){
        return x * x;
    }
    // overloading return_square with different input type
    double return_square(double x){
        return x * x
    }

In C++  template functions  or classes  can be  considered a
blueprint. This allows  to share the logic  for a particular
function that may  operate on different types  such as ints,
floats,  doubles or  some  other  more complicated  abstract
classes.

The general format of templated functions looks like

    template <class T>
    T return_square(T x){
        return x * x;
    }

A  general  (undefined) type  T  is  used  here to  write  a
template to the  function. When using the  function the type
can either  be inferred  from the input  by the  compiler or
explicitly set:

    int main(){
        int x = 3;
        int y = return_square<int>(x); // returns 9
        double k = 3;
        auto z = return_square(k); // assigned 9.0 to double z
    }


<a id="org4170cb6"></a>

## Templates in Cython

In Cython,  template functions work  the same way as  in C++
with  slightly different  syntax.  The use  of templates  in
Cython can be  used to wrap C++ only; it  is not possible to
write templated code directly in cython unless you use fused
types  which has  some  limitations. I  won&rsquo;t  go into  this
further in this post.

The general form of a Cython
template is

    # inside a pxd or pyx file
    cdef from extern "return_square.h":
        T return_square[T](T x)

The \`extern\` keyword is the same as in C++/C which tells the
compiler that  there exists  some external function  that is
not  defined in  the current  source file.  In this  case we
refer to  a header file &ldquo;return\\\_square.h&rdquo;  that contains our
C++ template above. The general  type T is defined in square
brackets and forms the  same function as \`template<class T>\`
above. The rest is the same as a template in C++.


<a id="orgc1a22ba"></a>

# Let&rsquo;s get freaky

Now the  example above is  sort of  what is avaiable  on the
cython docs. Where it becomes undocumented for me was when I
wanted to wrap \`std::inserter\`  from the standard library in
C++. For  those of  you not  familiar, \`std::inserter\`  is a
wrapper for the  function \`std::front\_inserter\` which allows
you to insert elements in to an  iterable such as a set or a
vector. From the C++ docs we read

    //Defined in header <iterator>
    template< class Container >
    std::insert_iterator<Container> inserter( Container& c, typename Container::iterator i );

Wrapping  this   function  only  takes  a   single  template
parameter  \`Container\`,  however   the  function  takes  two
argument   which  introduces   another  template   parameter
\`Container::iterator\`.  Initially I  was hoping  that Cython
would somehow &ldquo;know&rdquo; that  providing two templates variables
would allow the  function to be bound correctly.  That is, I
started with:

    cdef extern from "<iterator>" namespace "std" nogil:
       void insert_iterator[Container, Iter](Container &c, Iter i)

this did not  compile however. The compiler  stated that the
templated function could not be  found, as the header merely
states that there is only one template parameter.

Wrapping C++ classes in cython is also possible. Since there
are not that many options to try, I attempted the following:

    cdef extern from "<iterator>" namespace "std" nogil:
        cdef cppclass insert_iterator[T]:
            cppclass iterator[T]:
                pass
            insert_iterator(T & c, iterator[T] i)

This compiled perfectly! The magic here, essentially is that
I  treat  the  function  as  a  class  that  has  additional
properties defined.  That is,  I convince the  compiler that
the iterator exists and it  is associated with the templated
parameter  T. The  wrapping is  a bit  opague as  it is  not
entirely clear  what this  iterator object is.  Changing the
name to \`mega\_zuba\_loo\` would work equally well. It is up to
the programmer  to provide  clear indication  as to  what is
wrapped  and  provide the  correct  inputs  in the  code  in
addition.


<a id="orgad3284d"></a>

# Summary

-   Template functions and classes  allow programmers to share
    logic in C++
-   Templated code  can be wrapped  in cython allowing  one to
    capitalize on the power of C/C++
    -   Wrapping more &ldquo;complicated&rdquo;  functions requires some odd
        non-intuitive syntax.

