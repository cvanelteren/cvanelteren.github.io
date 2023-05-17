---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Covid dashboard"
subtitle: ""
summary: "Furthering the D3 journey"
authors: []
tags: [D3]
categories: []
date: 2022-02-09T13:52:18+01:00
lastmod: 2022-02-09T13:52:18+01:00
featured: true
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

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://d3js.org/d3.v7.js"></script>
<script src="https://unpkg.com/d3-simple-slider"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-array@3"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-geo@3"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-geo-projection@4"></script>


<!-- <canvas id="dash" width = "500" height = "500" style ="border:1px solid #000000"></canvas> -->

Under construction :construction:!

<div id ="mdash">
<svg id="dash" width = "500" height = "500" style ="border:1px solid #000000"></svg>
<div id="dash-slider"></div>
</div>
<script src="./dash.js"></script>


# What is happening here?

I initially wrote some code to provide a dashboard in jupyter with matplotlib for interfacing 
with the covid data in the Netherlands, see [here](http://cvanelteren.github.io/project/covid_dashboard). As I started my D3 journey (see [here](https://cvanelteren.github.io/post/d3/)) I wanted to remake the dashboard in javascript.
