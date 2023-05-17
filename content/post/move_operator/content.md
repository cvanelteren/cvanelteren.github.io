
# Table of Contents

1.  [L an R values](#orge54bfa1)
    1.  [Conversion between l and r-values](#org41bbf45)
2.  [Move operator](#org32a2fbc)


<a id="orge54bfa1"></a>

# L an R values

<https://eli.thegreenplace.net/2011/12/15/understanding-lvalues-and-rvalues-in-c-and-c/>
A *locator value* or  *l-value* represents some identifiable
location  in  memory.  In  contrast an  *r-value*  does  not
represent some identifiable location  in memory. For example
and r-value are temporary assigned variables such as

    int a = 3; // the r-value 3 is assigned to the l-value a
    1 + 1; // nothing being assigned -> non-l values
    4 = a; // 4 is an r-value and this will error

The C99 standard added the  \`const\` keyword which meant that
now  a distinction  needed  to be  made between  *modifiable
l-values* and *non-modifiable l-values* :

    const int b = 10;
    b = -1; // not allowed, assignment of const l-value.


<a id="org41bbf45"></a>

## Conversion between l and r-values

What happens when in the snippet below to \`c\`?

    int a = 3; // l-value a gets r-value assigned
    int b = 4; // l-value b gets r-value assigned
    int c = a + b; // a, b l-values gets converted to r-values


<a id="org32a2fbc"></a>

# Move operator

