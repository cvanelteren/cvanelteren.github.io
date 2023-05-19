---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Customizing Wowchemy"
subtitle: ""
summary: "Fixing some annoyances on my website"
authors: []
tags: []
categories: [Wowchemy]
date: 2023-05-19T16:34:44+02:00
lastmod: 2023-05-19T16:34:44+02:00
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
# Table of Contents

1.  [Site 2.0](#org488dae5)
    1.  [Goals](#org822527b)
2.  [Customizing a block](#org58bd05a)
3.  [Concluding statements](#orga0b7b60)

Having a web-pressence is excellent for you to create a portfolio, for people to
get in contact with your, or share some randoms thoughts on your favorite topic.
Years ago I was on the journey to create a webpage, but was quickly sucked into
the endless possibilities of web design. Should I go for Vue.js, REACT, or maybe
a different web programming language such as svelte or supersets of javascript
such as typescipt. Possibilities are endless, but for those starting out it is a
daunting undertaking.

Enter website generators that take away the initial pain of designing layouts
for websites. These generators provide a batteries included approach to the web,
offering you a landing page with some optional widgets that gets you started on
creating a personalized corner of the web. I too started out in this manner.
Years ago, I wanted a web page that would help reflect my academic endeavors.
The portfolio would need to consist of talks, links to slides and or papers.
Hugo academic  was the generator I used for web design. For
years Hugo academic work perfectly well. However, as time passed my page began
to feel stale and I wanted to display something more exciting on my page.
Websites become more capable of running full fledged apps and more and more
standalone software was pushed to have a web component. I felt like I was left
behind. You see, using a generator kicks off the process of getting a website.
However, it did not gave me insights in *how* the website was generated. I still
felt like I was stuck at square one. As such I slowly began to interface with
the code that was generated. I started first with customization and later on
created a site navigator with networks in javascript. I was starting to web
design!

All things changed, however, when Hugo Academic was re-branded to Wowchemy. The
change in name was reflected with a change in design. Every now and again when I
wanted to write a new post, my website would be faced with upgrading issues.
Especially since my code base originated from Hugo Academic. My need for
customization grew and grew, but my frustration with the process of wowchemy did
too. I am currently faced with a dilemma; I either decide to leave the framework
behind, and create something from scratch *or* I figure out how to effectively
interface with wowchemy such that I can work with it more pleasently.


<a id="org488dae5"></a>

# Site 2.0

Enter site 2.0; on the surface I does not look any different from my old website
except some rounded corners here and there. Under the hood, however, I am able
to more deeply change the feel of the webpages.


<a id="org822527b"></a>

## Goals

First, I wanted to change the look and feel of some widgets on the web page.
Wowchemy calls these nowadays &ldquo;blocks&rdquo;. The process of changing these pages is a
bit ill-documented so I am here to outline what my current understanding is of
how wowchemy blocks can be modified to your hearts desire. I started out by just
plain googling and found a post by A.J. Campell which was greatly helpful and I
copied his landing design ([here](https://www.adam-campbell.com/post/wowchemy-customisations/)). But let&rsquo;s first decide
on some goals.

1.  I want to understand *how* I can modify the look and feel of my website
2.  I want to be able to control and extend the look and feel of my website

Note 2 is implied by 1 but is not necessary a consequence of 1.


<a id="org58bd05a"></a>

# Customizing a block

A web page consists of different elements that can be blocked by \`divs\`.
Wowchemy organizes a webpage with widgets called blocks. The blocks are
pre-defined views of content such as a portfolio, landing page, how posts are
viewed (you get the drift). To customize a block we need to create a new
directory from the root folder of our site as

    mkdir -p layouts/partials/blocks/v1

I don&rsquo;t know why they called it v1, but it implies that they are going to change
this in the future again (and I will probably write a post about it again). Now
the reasoning is as follows, when you build your site, wowchemy pulls default
templates from repos and puts them in the public folder which constitutes your
website. If a local path if present, the local edit will take precedence over
the default template. You will override the template. In past iterations of
wowchemy this process was under \`./layouts/partials/widgets/\`, and the structure
of the go code inside these folders was also different. At the time over writing
for version v5.7, the blocks structure is what should be aimed for. One can take
the
[default
templates](https://github.com/wowchemy/wowchemy-hugo-themes/tree/main/modules/wowchemy/layouts/partials/blocks), and edit the html files to change the look and feel of the
website, and one can also create new blocks to extend your website: mission accomplished.


<a id="orga0b7b60"></a>

# Concluding statements

This is a pretty short post with a seemingly simple statement. However, from the
user perspective it was a little tricky figuring this out. My website was
working before with edits using and older version of wowchemy. Every X updates
it seems like the updates break things that need not have fixing. It would be
nice if their documentation is edited to walk somebody through building as
simple block from scratch. I am not too familiar with the go environment and
therefore reading statements such as \`{{ .page.Params.Author }}\` intermixed with
traditional HTML was a bit confusing in how these magic lines were interfacing
with the website (a veteran in GO is probably laughing hysterically right now).
This post is more written for future me;

-   In the future take your time to read your error statements
-   Take care of the low hanging fruit first, before tackling the more difficult problem
-   Always use simple test files to test hypotheses why something is not working.
