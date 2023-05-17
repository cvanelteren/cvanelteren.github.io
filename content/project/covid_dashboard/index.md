---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Covid dashboard"
subtitle: ""
summary: "How the pandemic spread through the Netherlands. Click for pretty animations!"
authors: []
tags: [data analysis, coding, visualization]
categories: []
date: 2021-04-15T19:38:11+02:00
lastmod: 2021-04-15T19:38:11+02:00
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: true

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: ["covid_dashboard"]
---


<video playsinline autoplay controls mute loop>
 <source src = "covid_anim.webm" type = "video/webm">
 <source src = "test.mp4" type = "video/mp4">
</video>

Covid "dashboard" I made over the winter. Data is sourced from the [Dutch national corona dashboard](https://coronadashboard.rijksoverheid.nl/).

In order to reflect the spatio-temporal effects of corona, the data consists of three categories per municipality. Namely, it consists of total cases, number of people hospitalized, and the total number of deceased due to corona at per publication date. I designed a metric which I dubbed "relative severity" which had the goal to:

1. Reflect the relative contribution to the source vectors at each time point;
2. Include a memory effect of the contribution over time;
3. Take into account the number of people living in that municipality.

For municipality $j$ the  relative severity for source $s_i \in \\{\textrm{total reported, hospitalized, deceased}\\}$ at time $t$  was computed as

$$ R_j(s_{ij}^t) = \frac{1}{Z_j \sum_k R_k(s_i^t)}\sum_{\tau =0}^t s_{ij}^{\tau},$$

were $Z_j$ is the number of people living in municipality $j$, and $s_{ij}$ is one of the sources (total cases, hospitalized, deceased) in municipality $j$.
The percentile of $R_j(s_i^t)$ at each time $t$ is then computed and plotted above. 

 



