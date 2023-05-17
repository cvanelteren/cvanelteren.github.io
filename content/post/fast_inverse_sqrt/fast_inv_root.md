

# Introduction

Commuting can  be a stressful (but  unfortunately mandatory)
event  of some  peoples lives.  When waiting  for the  bus I
can&rsquo;t help but  think &ldquo;Why can&rsquo;t the bus just  be here&rdquo;; the
sense of  speed creates a  pressure in  the back of  my head
similar to  when an  app is  not loading  fast enough  or my
numerical computations  move from hours into  days. With the
advent of modern  technology, I often reflect  on this silly
drive for speed.  Compared to the days of old,  we are faced
with unprecedented speeds in the  magic rectangle most of us
stare  into. Yet,  I have  carried  with me  this monkey  of
pressure to make things go fast.

Some time  ago, I  came across a  tiny program  called &ldquo;fast
inverse square root&rdquo; which  combines knowledge from computer
science  and calculus  to  provide a  fast approximation  to
computing   the  inverse   square  root.   It  is   at  this
intersection that  my interests peaks. Expertise  comes from
some combination  of talent  and expertise. Some  people may
have great analytical skill, providing solutions to problems
that have come to pass or  has yet come to pass. Others, are
wizard at  coming up with practical  solutions. My interest
is mostly in the ill-defined &ldquo;in-between&rdquo;, those people that
show general skill in a wide variety of fields but an expert
in none.

The fast inverse square  root program gained popularity after
the release of the Quake 3 engine. It is commonly thought to
be  created  by the  famous  John  Carmack, however,  modern
interpretations attributes the code  idiom William Kahan and
K.C. Ng in 1986.

The  beauty  of  this  bit  of  code  is  that  it  combines
fundamental insights  from the representation of  numbers in
computers as  well as  concepts from  calculus to  combine a
fast approximation to a common problem. Most importantly, it
made programs at the time go vroom-vroom. In this blog post,
I will  review the fast-inverse  square function and  in the
mean time review some  concepts about number representation,
and approximations using calculus.


# The Problem, The program, and the wonder

The original  Quake 3 code was  written in C. Here  I give a
implementation in Nim.

    import std/bitops
    proc Q_rsqrt(number: float32): float32 =
      #computes fast inverse square root
      #y(x) = 1/sqrt(x)
      var i: uint32
      var x2: float32
      let threehalfs: float32 = 1.5
      x2 = number * 0.5
      result = number
      #evil hacks
      i = (cast[ptr uint32](result.addr))[] # bit hack
      i = 0x5f3759df - (i.rotateRightBits(1)) # negate exponent
      result = (cast[ptr float32](i.addr))[] # cast back
      #Newton step: integration
      result = result * (threehalfs - (x2 * result * result))
      #result = result * (threehalfs - (x2 * result * result))
    
    echo Q_rsqrt(4) # prints ~ 0.5

Naive implementation would be \`1/sqrt(2)\`.

General idea: division is expensive, and multiplication is cheap


# Representing numbers in a computer

-   How can we represent a number in a computer?
-   Scientific notation as inspiration for the notation of a number
-   IEEE754: normalized numbers, representation of floating point numbers
    -   For a given 32 bit number
    -   bit sign (1 bit)
    -   exponent (8 bits)
    -   mantissa (23 bits)
        
        binary  scientific notation  needs to  go from  1 ->  2,
        normal scientific notation from 1 -> 10
        
        log is performed to allow  for an approximation and then
        reverting the log afterwards.  The bit representation is
        its own logarithm.
        
        The representation of a number if as follows
        $ 1 + \frac{M}{2^23} + E$
        
        1            8                   23
        0     0000     0000   0000 0000 0000 0000 0000 000
        sign     exponent              fraction
        
        bit manipulation in floats is not normal
        
        $log_2  (1  +  \frac{M}{2^23}  2^{E-127}) =  log_2  (1  +
            \frac{M}{2^23}) + E - 127$

$log_2(1 + x) ~ x + \mu$
0.0430 smallest error

$\frac{M}{2^23} + \mu + E - 127$
$\frac{1}{2^23} (M + 2^23 E) + \mu - 127$

