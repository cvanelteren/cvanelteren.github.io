---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Expanding the farm"
subtitle: "The creation of the nim chicken"
summary: ""
authors: []
tags: [chickens, "coding"]
categories: []
date: 2021-06-25T19:47:55+02:00
lastmod: 2021-06-25T19:47:55+02:00
featured: false
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

In a previous post, I created the fastest chicken alive! I implemented a chicken in cpp and provided bindings in cython and python. However, our chicken Carl needs some friends. Today, I will implement a friend for Carl, in another morer niche language called `nim`; and I will show how nim can produce similarly fast chickens that can be called from python.

# What is Nim?
From their website:

> Nim is a statically typed compiled systems programming language. It combines succesful concepts from mature languages like Python, Ada and Modula

I am not familiar with the latter two, but I am quite familiar with python and it  can be used to solve one of python's weaknesses: python can be terribly slow for numerical problems.

Writing nim is similar to other modern languages like rust: it prefers inheritance over composition. However, it does not shy away from using "more" traditional methods. For example, in nim "classes" are called types and types can be composed (preferred) but can also inheret from oneanother. Which allows more ancient programmers like me to be able to use my toolset while also exploring composition more.


Writing nim looks very similar to python. Variables defined with the `var` keyword, functions are `proc` (process), printing is performed with `echo`, classes / structs are `types` and so on. 

Variables are typed, however the compiler is often very good at inferring the type you are assigning. This effectively means that defining a variable as

```nim
var x = 1
var x: int = 1
```
is the same, and `var` can be seen as implicitly using the `auto` keyword from cpp. For more details on nim see  their excellent tutorial on the website; let's start making our chicken friend!


# Nim chickens
Classes are called `types`. As want to bind to python, we make use of the `nimpy` library from nim. Fellow pythonistas should feel right at home

```nim
# import a package as per usual of python
import nimpy
# types are "classes"
# they are similar to structs
type Chicken = ref object of PyNimObjectExperimental
   name: string
```

We have  defined our  chicken `type`,  the ref  object makes
sure that  our types _inherents_  from the root  object that
makes sure our  chicken can be imported from  python. As can
be  seen  from  the  name, this  features  is  experimental.
Functions are  readily exportable to python,  but types have
only recently been added in. Not to worry, it will hopefully
improve over time. 

# Nim implementation
Similar, to our previous chicken Carl, we want our chicken to _do_ something

```nim
# on the structs we can define methods
proc set_name(self: Chicken, value : string) {.exportpy.}=
  self.name = value
proc get_name(self: Chicken): string  {.exportpy.}=
    self.name
proc peck(self: Chicken): void {.exportpy.} =
    echo "Peck peck!"
```

There is a lot going on in this piece, so let's step through it. The `proc` keyword is similar to `def` in python: it defines our function. Similar to type hinting our return type is given after the `:`. Nim, similar to other languages like matlab, implictly defines a `result` variable; return keywords are not necessary and last lines without assignment are automatically put into result. For example
```nim
proc some_test(x: float): float =
    result = x
proc some_test_other(x: float): float =
    return x
proc some_test_another(x: float): float =
    x
```
are equivalent. The curly brackets indicate compiler directives; `{.exportpy.}` tells the compiler to make these functions available in our shared object.

# Compilation
All that is left to do is to compile our chicken into a shared object and import it.

```
nim cpp -d:release --threads:on --app:lib --out:chicken.so chicken.nim
```

and, we are done! This is less boilerplate code than the cython approach. Compared to cython, nimpy is less mature. However, nim can readily interact with native c/cpp. It's mainly immature in the type export, but I hope that will improve in the future. It does form a nice alternative to more "verbose" cpp; it writes quite similar to python. Just to finish of the end, let's run our litle chicken


```python
#file: test_nim.py
from chicken import Chicken

c = Chicken()
c.set_name("Betsy")
print(f"My name is {c.get_name()}")
for i in range(10):
    c.peck()
```

generates

```
My name is Betsy
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

Betsy and Carl can now life together in python world, but they can also interact together in nim or cpp world.
 
# The nim-farm
So far we have been able to bind the nim type to python. Carl and Betsy can life happily ever after there. Nim is, however, also compiled. So we can also inhabit our little farm purely on the cpp side. This will look as follows: 
```nim
{.compile: "../cython_classes/chicken.cpp".}

type CChicken* {.header: "../cython_classes/chicken.hpp", importcpp: "Chicken".} = object
    name: cstring

proc peck*(this: CChicken) {.header: "../cython_classes/chicken.hpp", importcpp: "#.peck(@)".}

# var chick = CChicken()
var cchick = CChicken(name: "Carl")
var nchick = Chicken(name: "Betsy")

echo "We have two chickens now, introducing:"
echo nchick.name
echo cchick.name
for i in 1..10:
    nchick.peck()
    cchick.peck()
```
Now Betsy and Carl are the fastest two chickens across languages. Note that it is also possible to output nim to c/cpp, making it possible for Betsy and Carl to life across three worlds, but this is where I end the post for now. 


```
We have two chickens now, introducing:
Betsy
Carl
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

I hope Betsy and Carl get to know each other better! Soon we need to prepare for additional expansions. I'm looking at you `pybind11`. 

# Outlook 
Nim offers readable syntax and fast performance. It is a rather strange language as it originally released in 2008 but hasn't gotten much attention compared to more recent languages like rust.  I hope in the future I can apply this language more, for now I'm signing off. See you in the next post.
