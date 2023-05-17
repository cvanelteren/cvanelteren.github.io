
# Table of Contents

1.  [Introduction](#org8d7891c)
    1.  [TLDR](#org02e061d)
2.  [Starting the D3 Journey](#org9763250)
    1.  [Goals](#org22859dd)
    2.  [Setting up an environment](#org81e6722)
    3.  [Understanding D3s design](#org26d41fa)
    4.  [Making the first plot](#orge855feb)
    5.  [Adding interactivity](#org650d065)
        1.  [Designing mouseOver](#orgbcede09)
        2.  [Designing mouseLeave](#orgbc55fb9)
        3.  [Designing mouseMove](#orgb1c1c86)
        4.  [Bonus: adding a trend line](#orgd6b55cd)
    6.  [Putting the pieces together](#orgacb8da5)
3.  [Summary](#org80c6323)
    1.  [Honorable mentions](#orgfdeda20)

<style>

.links line {
  stroke: #999;
  stroke-opacity: 0.6;
}

.nodes circle {
  stroke: #fff;
  stroke-width: 1.5px;
}
</style>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://d3js.org/d3.v7.min.js"></script>
<div id="banner"></div>
<script src="./test2.js"></script>


<a id="org8d7891c"></a>

# Introduction

Data visualization is  a crucial tool to  gain insights into
data. For  data aficionados it  is a difficult task  to find
the  balance  between  visual prowess  and  meaningful  data
visualization.  My visualization  journey started  in matlab
many years ago. Matlab&rsquo;s visualization tool are powerful and
are  apart of  many scientist&rsquo;s  and engineers  toolkit. For
static plots,  matlab&rsquo;s toolkit is excellent.  However, over
the years  I got a  deeper desire for interactive  tools and
animations. Although this is  very much possible, the nature
of matplotlib&rsquo;s ecosystem  made it a bit  awkward in dealing
with  complicated  animations.  As years  passed,  I  slowly
transitioned to  the python scientific stack  which prompted
me to  switch to  matlab&rsquo;s equivalent matplotlib.  As python
gained providence among the scientific community, so did the
need  for interactive  visualizations. The  notebook culture
grew,  and  so did  the  ports  to  allow matplotlib  to  be
visualized in interactive contexts. Matplotlib has served me
well for many  years; having its roots  in matlab&rsquo;s plotting
ecosystem,  it  moved more  and  more  to object  orientated
design familiar  to many  pythonistas. However, I  was still
rather unhappy  with sharing matplotlib code.  Preferable, I
would like to  host the visualizations on a  website where a
user can interact and explore  with the data. For the python
ecosystem, this always requires a python interpreter running
on a server somewhere. I was aware of D3 for many years, and
was rather impressed by the visuals that it generates. After
doing several tutorial online over  the years, I felt rather
empty and left  with a lack of  understanding. Many tutorial
allow  you  to copy  paste,  but  not understand  *how*  the
visualization work  under the hood.  In the year 2022  it is
finally time to pick-up on  my previous attempts to learn D3
(and  javascript). The  focus will  be for  matplotlib users
that are interested in learning D3. I assume that the reader
is familiar  with base  programming. I  am not  too familiar
with  javascript,  and  as  such learning  that  will  be  a
secondary goal  for me. In  the end, I  aim to make  a graph
visualization tool with the use of  D3. In this post, I will
guide the reader in my process  and share my thoughts on how
the  code  works  internally. For  background  knowledge,  I
assume the reader is  familiar with matplotlib and generally
programming.


<a id="org02e061d"></a>

## TLDR

I wrote down some thoughts on making plots in D3 by using my
knowledge  from  matplotlib.  The   code  can  be  found  at
<http://cvanelteren.github.io/post/d3/first_plot.js> The final
plot is given below in [2.6](#orgacb8da5).


<a id="org9763250"></a>

# Starting the D3 Journey


<a id="org22859dd"></a>

## Goals

-   [ ] Familiarize with D3 ecosystem
    -   [ ] Make simple line plot
    -   [ ] Make simple scatter plot


<a id="org81e6722"></a>

## Setting up an environment

In  order to  work with  d3, it  is possible  to install  it
locally  with \`npm\`  (e.g. \`npm  install -g  d3\`) or  use it
directly  from  the  Contend Delivery  Network  (CDN).  This
latter option effectively acts as an import statement that a
device connected to  the internet could use. I  will use the
latter  option  as  the  target  is  running  visualizations
online. For more information one could follow [this tutorial](https://www.tutorialsteacher.com/d3js/setup-d3js-development-environment).
for setting it up locally. A typical modern website consists
of  three components:  the webpage  content, the  looks, and
possible external scripts. The workhorse for modern websites
is  Hyper  Markum Language  (HTML);  it  defines the  basics
structure of a  webpage. We will be writing  minimal HTML in
this post. All that is necessary to know is that HTML is the
&ldquo;core&rdquo; of how website determines where what goes. Javascript
can be used  to dynamically serve content  by interacting or
writing  HTML.  How  a  website  looks  is  controlled  with
Cascading Style Sheets or CSS.  The files are used to change
things like color, size of an  image and so on. Again CSS is
not the  focus here, it is  merely important to be  aware of
the base components  as D3 will interact  with them. Lastly,
javascript is in  essence the programming for the  web. I am
not an  expert in  any web-based development  and as  such I
would recommend elsewhere  for learning the ins  and outs of
javascript. My goal here is to  make pretty plots and use my
extensive  programming experience  to  just  figure out  the
syntax.

A minimal HTML file for D3 would look like:

    <!-- file: hello_d3.html -->
    <!doctype html>
    <html lang="en">
    <head>
      <!-- get module from cdn -->
      <script src="https://d3js.org/d3.v6.min.js"></script>
      <!-- or load it locally -->
      <!-- <script src="../d3.min.js"></script> -->
    </head>
    <body>
    
    <script>
        <!-- write your d3 code here.. -->
      <script src="./first_plot.js"></script>
    </script>
    </body>
    </html>

You can  view this file  by opening  this file in  a browser
(e.g. \`firefox hello<sub>d3.html</sub>\` or  equivalent for the browser
you  are  using). The  file  should  be empty.  Let&rsquo;s  start
filling it up with D3 goodiness!


<a id="org26d41fa"></a>

## Understanding D3s design

Traditional  matplotlib  had   concept  of  functions,  i.e.
\`plt.figure()\` would open a figure and \`plt.plot\` would plot
a line  plot in  the most  recent figure.  Modern matplotlib
uses an object oriented approach. A figure would opened like

There  is a  concept of  the &ldquo;figure&rdquo;  that hosts  different
subplots which each  hold different axes. These  axes can be
of   different  types   such  as   geographic,  polar,   the
traditional Euclidean  plane, and  so on.  There is  a clear
hierarchy on  what holds  what. In  matplotlib the  axes are
essentially which  interacts with the data.  In contrast, D3
assigns data attributes directly  to images. That is, inside
a &ldquo;canvas&rdquo; (plt.figure) scalable  vector graphics (svgs) are
created   which  gets   as   attributes  data   coordinates.
Effectively, D3  allows you to make  a cake but you  have to
provide  all  the  ingredients:  axes  are  not  created  by
default.


<a id="orge855feb"></a>

## Making the first plot

Let&rsquo;s  start  with  making  a scatter  plots.  We  start  by
creating a figure. I will write  the code for the first plot
in a  file names \`first\\<sub>plot.js</sub>\`  and will call it  from the
html we just created above, yielding:

    <!-- file: hello_d3.html -->
    <!doctype html>
    <html lang="en">
    <head>
      <!-- get module from cdn -->
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <!-- or load it locally -->
      <!-- <script src="../d3.min.js"></script> -->
      <script src="./first_plot.js"></script>
    </head>
    <body>
    
    <script>
        <!-- write your d3 code here.. -->
    </script>
    </body>
    </html>

Next, we  create our  figure by selecting  the \`#first\_ plot\`
div and  and adding a  graphic (svg) to  it. The svg  is now
empty, but we will soon fill it with some data.

    // define margins
     const margin = {top: 10,
                    right: 30,
                    bottom: 30,
                    left: 60};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // create canvas and select the graphics
    var svg = d3.select("#first_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

In this snippet we select a div in the html in which we want
to plot our  graph. We specify its width and  height and add
an svg  graphic to it.  In addition,  we append a  new group
(indicated by \`g\`) that is transformed (placed) a little bit
from the left and top. Playing around with the parameters is
highly  encourage to  see how  it affects  the plots.

Next, let&rsquo;s add some data. Data  can be loaded from a csv or
json  files,  I  opted  here to  learn  something  how  list
comprehensions can  be emulated  in javascript. I  create an
\`Array\` type  and specify  its length.  Then I  populate the
array with a function. One can read this procedure similarly
to a  list comprehension. That  is, `[some_func(x) for  x in
range(100)]`.

    // make scatter
    var data = Array.from({length: 1000}, (_, idx) => {
        return {x: idx * 0.1/ ( 2 * 3.141592 ),
                y:  (Math.sin(idx * 0.1/ ( 2 * 3.141592 )) +  1 * Math.random())}
        });

In order  to complete the  figure, we  need to tell  D3 what
axes to map the data on. In  order to do this, we create two
axes (x, y) to form a Euclidean plane.

    // construct axes
    const x = d3.scaleLinear()
          .domain([0, 100])
          .range([ 0, width ]);
    
    const y = d3.scaleLinear()
          .domain([ 0, 100])
          .range([ height, 0 ]);

Note that the coordinate system  starts from a imaginary box
on the top  left. Hence, the y-axis needs to  be moved (with
the \`.range\` property) down  by \`height\` which was specified
in the canvas  specs. Similarly, the x-axis  spans the width
of our canvas.

The axes  need to  be added  to our  svg. For  a traditional
plot, the  x-axis has to be  moved \`height\` down to  yield a
traditional xy plane.

    // add axes
    svg.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(d3.axisBottom(x));
    
     svg.append("g")
        .call(d3.axisLeft(y));

Finally, we  add  the images  to  the svg  by
specifying another  grounp \`g\` and popuplating  it using the
\`data\` function.  The centers of the  circles are specificed
by  maps  again. The  funny  \`d\`  syntax specifies  a  lamba
function. This is the same  as \`lambda x: [some expression]\`
in python. Finally, attributes such  as the color and radius
(\`r\`) are set.

    var scatter = svg.append("g")
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 2)
        .style("fill", "#729B79");

We are now  ready to plot! Running the final  HTML code in a
browser should  yield a fancy  sine plot with  some noise.


<a id="org650d065"></a>

## Adding interactivity

The plot above is a bit boring. Where D3 really shines is in
its interactivity. What if we  want to know exactly what the
xy  coordinates are  in  the  plot? Let&rsquo;s  find  out how  to
achieve this.

We add  a hover tool to  display the x,y coordinates  of the
generated data. This  involves adding another div  to put in
some HTML. We  start by setting the opacity to  0, hiding it
from view and &ldquo;popping&rdquo; it back  into view when a data point
is selected.

    // create a tooltip
    var Tooltip = d3.select("#first_plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "gray")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

Next, we  have to  define the behavior  what happens  to the
toolbar (and the  dots) when the mouse hovers  over it. This
means we have to create 3 functions

-   mouseOver: when the mouse moves over the point
-   mouseLeave: when the mouse leaves the point
-   mouseMove: when the mouse moves


<a id="orgbcede09"></a>

### Designing mouseOver

In  order to  let  the  datapoint shine,  we  turn down  the
opacity  and  highlight  the selected  point.  Finally,  the
tooltip has to popup, reflecting the data coordinates.

    let mouseOver = function(d) {
      // turn down opacity of all other circles
      d3.selectAll("circle")
        .transition()
        .duration(200)
        .style("opacity", .5)
    
      // make selection yellow
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("fill", "yellow")
    
      // update tooltip
      Tooltip
          .style("opacity", 1)
    }


<a id="orgbc55fb9"></a>

### Designing mouseLeave

This  does the  effective  opposite of  the function  above;
turning down up the opacity of all other dots.

    
    let mouseLeave = function(d) {
      d3.selectAll("circle")
        .transition()
        .duration(200)
        .style("opacity", .8)
    
      d3.select(this)
        .transition()
        .duration(200)
        // .style("fill", "transparent")
        .style("fill", "#729B79")
    
      // update tooltip
      Tooltip
          .style("opacity", 0)
    }


<a id="orgb1c1c86"></a>

### Designing mouseMove

This function removes  the toolbox when the  mouse is moved.
This makes sure the toolbox does not confuse the enduser.

    let mouseMove = function(event, d) {
      Tooltip
          .html(`x: ${d.x} <br> y: ${d.y}`) // print inside the tooltip
          .style("left", event.pageX + "px") // move the toolbox to the correct position
          .style("top", event.pageY + "px")
      }


<a id="orgd6b55cd"></a>

### Bonus: adding a trend line

As a  bonus we add  a trend line to  show how well  our data
fits a trend.

    // trend curving
    let c = d3.curveNatural;
    svg
      .append("path")
      .datum(data)
      .attr("stroke", "#475B63")
      .attr("fill", "transparent")
      .attr("stoke-width", 1.5)
      .attr("d", d3.line()
            .x(d => x(d.x))
            .y(d => y(d.y))
            .curve(c)
           )


<a id="orgacb8da5"></a>

## Putting the pieces together

Next, we  need to tell D3  to add this functionality  to the
dots only. We add the  functions to the scatter dots defined
above, yielding:

    var scatter = svg.append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 5)
      .style("fill", "blue")
      .on("mouseover", mouseOver) // new
      .on("mouseleave", mouseLeave) // new
      .on("mousemove", mouseMove) // new

<div id="first_plot"></div>
<script src="./first_plot.js"></script>

We have  now created an  interactive scatter plot!  The TLDR
code          can           be          found          under
<http://cvanelteren.github.io/post/d3/first_plot.js>.


<a id="org80c6323"></a>

# Summary

We have seen how to create  a simple plot in D3. Compared to
matplotlib  D3  is  more   verbose;  everything  has  to  be
specified. Some packages do exist that build on top of D3 to
prevent this verboseness (e.g.  Chart.js), however, for full
control  one  needs to  dive  in  deep  with D3.  The  major
advantage for D3 is its portable  (it can exist in the web),
and interactivity.  Building a shiny dashboard  to visualize
your  major findings  for data  analysts and  scientists are
hard to  beat. For  producing quality publication  graphs, I
would still stick to matplotlib however. In summary we have:

-   D3 allows for high quality data-driven documents;
    -   May form the basis for dashboard;
-   Learning curve is relatively high and requires more amount
    of coding than matplotlib;
    -   D3 allow  for full  control which comes  at the  cost of
        verbose coding practices;
    -   It is flexible, and can produce beautiful graphs (see [here](https://www.d3-graph-gallery.com/index.html));
-   Interactivity  is  a  real  benefit  for  D3  compared  to
    matplotlib.

In future  posts I will  explore the data  visualizations on
networks a bit more. See you in the next one!


<a id="orgfdeda20"></a>

## Honorable mentions

These packages  exist for making  pretty plots in  python or
can convert to content that can be hosted on the web.

-   [mpld3](http://mpld3.github.io/) converts matplotlib figures to D3.
-   [plotly  (and  dash)](https://plotly.com/dash/)  use   plotly  to  make  nice  looking
    dashboard.
-   [Bokeh](https://docs.bokeh.org/en/latest/index.html): D3 for python
-   [Proplot](https://proplot.readthedocs.io/en/latest/): matplotlib but with sensible defaults
-   [Seaborn](https://seaborn.pydata.org/): additional functionality on top of matplotlib

