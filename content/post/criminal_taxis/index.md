---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Criminal taxis"
subtitle: "Exploring a simple model for celmovement"
summary: ""
authors: []
tags: []
categories: []
date: 2022-02-10T13:21:24+01:00
lastmod: 2022-02-10T13:21:24+01:00
featured: false
draft: true

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

<style>
.tag {
  fill: white !important;
}
</style>


<link href="asset/css/css" rel="stylesheet">

<link href="asset/css/css" rel="stylesheet">
<link href="asset/css/app.d98f2eb6bcd1eaedb7edf166bd16af26.css" rel="stylesheet">
    

<link href="asset/css/explorables.css" rel="stylesheet" type="text/css" />
<link href="asset/css/widget.v3.css" rel="stylesheet" type="text/css" />
<link href="asset/css/come-together.css" rel="stylesheet" type="text/css" />

<div class="flex flex-wrap  justify-around center">
    <div class="mw-30" id="cxpbox_come-together_display">
    </div>
    <div class="mw-30" id="cxpbox_come-together_controls">
    </div>
</div>


<script type="text/javascript" src="asset/js/d3.v4.min.js"></script>
<!-- <script src="https://d3js.org/d3.v7.js"></script> -->
<script type="text/javascript" src="asset/js/d3-array.min.js"></script>
<script type="text/javascript" src="asset/js/lattice.v4.min.js"></script>
<script type="text/javascript" src="asset/js/widget.v3.6.min.js"></script>



<script  src="asset/js/come-together.js" ></script>

Animation        and       applet        original       from
https://www.complexity-explorables.org/explorables/come-together/.
Code is adapted and changed for simulation purposes.

In the vanilla model every agent $s_i \in S = \\{s_1, \dots,
s_n\\}$ has a few properties:
- state $\in \\{0, 1, 2 \\}$ (non-active, firing, recovered)
- label (pacemaker or normal)
- location (random on grid)
- cAMP concentration (defaults to 0)
- Recovery time

The movement  of each  agents goes in  the direction  of the
cAMP  gradient. Initially,  the pacemaker  fires at  regular
intervals  (given by  the recovery  time). After  firing, an
agent will disperse cAMP into its surrounding. The effect of
cAMP will  decay exponentially,  and can be  controlled with
cAMP pulse strength above.

The  idea is  to  give  each agent  "access"  to a  criminal
market. This information parameter can be interpreted as the
firing rate in  the original model. A high  firing rate will
disperse  lots of  cAMP  in the  surrounding  whereas a  low
firing rate  will not.  The firing rate  is controlled  by a
`clock` parameter.  Everytime an agent  fires, it is  put in
the rest (=2) state. A clock starts tiking until it hits the
recovery  threshold. The  rate  control when  the agent  can
fire; essentially a binomial  process after the initial rest
period.


