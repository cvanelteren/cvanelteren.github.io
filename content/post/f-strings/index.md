---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "F-strings are awesome!"
subtitle: "Exploring some neat features I wasn't aware of"
summary: ""
authors: []
tags: [coding, python]
categories: []
date: 2021-06-09T08:34:46+02:00
lastmod: 2021-06-09T08:34:46+02:00
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

If you know python, you are probably aware of its value. The language is easy to
develop in, which allows for quick proto-typing. It is used by many professional
companies either as glue to bind compiled languages together, or as a full-stack
for    their     apps.    With     the    advent     of    python     3.6    and
[[pep498][https://www.python.org/dev/peps/pep-0498/]]  f-strings   arrived.  Its
longer name  is formatted string  literals or f-strings  for short ;-).  This is
probably  one of  my  favorite python  feature  next to  dicts  being sorted  by
default.

# What are f-strings?
When you are either debugging or writing some logging library, strings (in my opinion) were always a hassle to deal with. In order to write the output of a variable one would either write

```python
some_variable = "hello world!"
print("Some variable = " + some_variable)
print("Some variable = %s".format(some_variable))
```
The top choice is not that bad, but the bottom one gets complicated when formatting get more complex. With F-strings this procedure can be simplified by writing:

```python
some_variable = "hello world!"
print(f"Some variable = {some_variable}")
```
Merely by adding the formatting operator "f" in front of the string, the output becomes more readble. This has the advantage of literate programming; in plain langauge one can read this sentence and understand its output in normal plain language. Since the feature became available I quickly replaced the old formatting style with this newer better way: f-strings became the norm.

In my normal debugging routine, I am not used to using full-featured debuggers that can step in and out of functions allowing to see local scopes: very fancy! I usually resort to print statements, and lots of coffee and pacing around my room. F-strings allowed for quicker and clearer debugging. This prompts me to write this post now, what else can F-strings do?

# Capabilities of f-strings
F-strings can do a great number of things. One of the major advantages for me is making readable strings as was indicated above.

## Formatting

F-strings allow for formatting opertors to be passed in. Say you have a float with 10 decimes but you only want to plot the rounded number. One option would be to do:
```python
a = 1.23123512351234
print(f"{round(a, 2)}")

```
This however, quickly makes the f-string "complicated". Luckliy f-strings allow for format operators to be used

```python
a = 1.23123512351234
print(f"{a:.2f}") # prints up to 2 precision
```

Next to rouding formats, one can also apply alignment of text

```python
text = "hello world"
print(f"{text: >}") # right align
print(f"{text: <}") # left align [default often]
print(f"{text: ^}") # center align 
```
There are many more possibilites, including aligning only if the text goes bigger than a certain predetermined number of digits or formatting numbers to hex, binary, leading space for positive numbers and so on. In fact there is a minilanguage that it uses that can be found on the python docs.

## Lambda functions
The colon is used for formatting indicator. This  prevents lambda functions from being used directly. However, by encapsupating the lambda function one is still able to insert lambda functions inside an f-string.

```python
print(f"This is the output of two times 2 {(lambda x: x*2)(2)}")
```

### Debugging
In debugging I often revert to writing the output to check the state of some object. This results in boilerplate statements that I wish to prevent. Luckily, f-strings can to this with `=` formatting.
```python
some_variables = "ERROR!"
print(f"{some_variable=}")
```

will print out
```
some_variable = "ERROR"
```
Pretty neat! This reduces the need to write out the variable statement completely.

