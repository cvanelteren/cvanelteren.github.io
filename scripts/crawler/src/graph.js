//LICENSE:  BSD-3-Clause
//AUTHOR: Casper van Elteren
//Copyright 2022 Casper van Elteren
//
//Redistribution and use in source and binary forms, with or
//without  modification,  are  permitted provided  that  the
//following conditions are met:
//
//1. Redistributions  of source  code must retain  the above
//copyright  notice,   this  list  of  conditions   and  the
//following disclaimer.
//
//2. Redistributions in binary form must reproduce the above
//copyright  notice,   this  list  of  conditions   and  the
//following  disclaimer in  the  documentation and/or  other
//materials provided with the distribution.
//
//3. Neither the name of  the copyright holder nor the names
//of  its contributors  may be  used to  endorse or  promote
//products derived from this software without specific prior
//written permission.

//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//THIS  SOFTWARE IS  PROVIDED BY  THE COPYRIGHT  HOLDERS AND
//CONTRIBUTORS   "AS  IS"   AND  ANY   EXPRESS  OR   IMPLIED
//WARRANTIES,  INCLUDING, BUT  NOT LIMITED  TO, THE  IMPLIED
//WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
//PURPOSE ARE  DISCLAIMED. IN  NO EVENT SHALL  THE COPYRIGHT
//HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//INCIDENTAL, SPECIAL,  EXEMPLARY, OR  CONSEQUENTIAL DAMAGES
//(INCLUDING, BUT NOT LIMITED  TO, PROCUREMENT OF SUBSTITUTE
//GOODS  OR SERVICES;  LOSS  OF USE,  DATA,  OR PROFITS;  OR
//BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//LIABILITY, WHETHER IN CONTRACT,  STRICT LIABILITY, OR TORT
//(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
//OF  THE USE  OF  THIS  SOFTWARE, EVEN  IF  ADVISED OF  THE
//POSSIBILITY OF SUCH DAMAGE.

import {make_graph} from "./crawler.js"
const fetch = require("node-fetch")
const cheerio = require("cheerio")
const jLouvain = require("../jLouvain/src/jLouvain")
const mpl_map = require("../js-colormaps/js-colormaps.js")

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
  height = 1000 - margin.top - margin.bottom;

var width = 700, height = 700;
var svg = d3.select("#banner").select("svg")
if (svg.empty()) {
    svg = d3.select("#banner").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

}
var active_link = "red";
var default_link = "gray";


// create a tooltip
var Tooltip = d3.select("#banner")
  .append("div")
  .style("opacity", 0)
  .style("hidden", 1)
  // .style("margin", "auto auto")
  .attr("class", "tooltip")
  .style("text-align", "center")
  // .style("background-color", "gray")
  // .style("border", "solid")
  // .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


var cmap;


async function load_data(){
    // const data = d3.json("test.json")
    const data = await make_graph();

    console.log(data)
    return data;

}
async function main(){
    let data = await load_data();

    var nodes = data.nodes;
    var links = data.links;

    let node_labels = Array.from(nodes, d => {d.id})
    let partition = Array.from(node_labels, (d, idx) => {[d, idx]})
    console.log(partition)
    var community = jLouvain()
        .nodes(nodes.map(i => i.id))
        .edges(links)
        // .partition_init(partition)
    let community_label = community();
    for (var p in node_labels){
        console.log(p, community_label[nodes[p].id])
    }

    // console.log(links)
    // console.log(nodes)

    const N = d3.map(nodes, d => d.id)
    console.log(N)
    console.log(links[0])
    console.log(N.length)

  let z = 1/(nodes.length)
  // let gen = d3.interpolateRainbow;
  let gen = d3.schemeTableau10

  let colors = Array.from({length: nodes.length}, (_, idx) => {

    return gen[idx % 10]
  })

  let labels = Array.from(nodes, d =>  d.id)
  cmap = Object.fromEntries(labels.map(
    (d, idx) => {
      return [ d, colors[idx] ]
    })
  )
  console.log("colormap")
  console.log(cmap)


    var force = d3.forceSimulation(nodes)
        .force("center", d3.forceCenter())
        .force("link", d3.forceLink(links).id( ({index: i}) => N[i]))
        .force("charge", d3.forceManyBody().strength(-900))
        .on("tick", ticked)


    var link = svg.append("g")
        .attr("stroke", default_link)
        .selectAll("line")
        .data(links)
        .join("line");

    var node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .style("fill", d => {
            return cmap[d.id]
            return colors[community_label[d.id]]
        })
      .attr("r", 15).call(drag(force))
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      // .on("mousemove", mouseMove)
      .on("mouseout", mouseOut)
      // .on("touchmove", mouseMove)
      .on("dblclick", mouseClick)
      .on("click", mouseOver)




    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked(){
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);


    }
    console.log(force)
    console.log('done')

}
function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
  }


let mouseClick = function(d) {
  let url = d.target.__data__.id
  console.log("Clicked", url)
  var tag = document.createElement("a")
  tag.href = url
  // document.body.appendChild(tag)
  tag.click()
  // elem.click()
}

let mouseOver = async function(event, d) {
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

  // console.log(d)

  d3.selectAll("line")
    .transition()
    .duration(200)
    .style("opacity", o => {
      return o.source.id == d.id || o.target.id == d.id ? 1 : 0
    })
    .style("stroke", o => {
      return o.source.id == d.id || o.target.id == d.id ? active_link : default_link
    })

  let url = d.id.replace(/^\s+|\s+$/gm, '')
  // console.log(url.split("/"))
  var path_array = url.split("/")

  var title = path_array[path_array.length - 1];
  if (title == ""){
       title = path_array[path_array.length - 1]
  }

  // console.log(path_array, title)
  if (!(String(title).includes("#"))){
      if (title.endsWith(".pdf")){
          title = title.split(".")[0]
      }
      else{
       title= await extract_title(url)
      }
  }
    let q = ` <h4>${title}</h4>  <p align="aligncenter"><img src="${url}/featured.png" alt =""></p>`
    Tooltip
      .html(q)
      .style("left", event.layerX + 10 + "px")
      .style("top", event.layerY + "px")
      .style("opacity", 1)
      .style("width", "auto")
      .style("height", "auto")
      .style("max-width", "50%")
      .style("max-height", "40%")

  // // update tooltip
  // Tooltip
  //    .style("opacity", 1)
  //    .style("visibility", true)

}

let mouseLeave = function(event, d) {
  // update tooltip
  Tooltip
      // .style("opacity", 0.5)
      .html("")
      .style("left", "0px")
      .style("top", "0px")

  d3.selectAll("circle")
    .transition()
    .duration(200)
    .style("opacity", 1)

  d3.selectAll("line")
    .transition()
    .duration(200)
    .style("stroke", default_link)
    .style("opacity", 1)

  d3.select(this)
    .transition()
    .duration(200)
    // .style("fill", "transparent")
    .style("fill", cmap[this.__data__.id])


}


async function extract_title(url){
    return await fetch(url).then(async d => {
        var page = cheerio.load(await d.text());
        let title = page( "title" ).text();
        return title;
    })
}
let mouseOut = function(event, d){
    Tooltip.style("opacity", 0)
    d3.select(this)
        .style("fill", cmap[this.__data__.id])
}

let mouseMove = async function(event, d) {

  let url = d.id.replace(/^\s+|\s+$/gm, '')
  // console.log(url.split("/"))
  var path_array = url.split("/")

  var title = path_array[path_array.length - 1];
  if (title == ""){
       title = path_array[path_array.length - 1]
  }

  // console.log(path_array, title)
  if (!(String(title).includes("#"))){
      if (title.endsWith(".pdf")){
          title = title.split(".")[0]
      }
      else{
       title= await extract_title(url)
      }
  }
    let q = ` <h4>${title}</h4>  <p align="aligncenter"><img src="${url}/featured.png" alt =""></p>`
    Tooltip
      .html(q)
      .style("left", event.layerX + 100 + "px")
      .style("top", event.layerY + "px")
      .style("width", "auto")
      .style("height", "auto")
      .style("max-width", "50%")
      .style("max-height", "40%")
      // .style("maxWidth", "50%")
      // .style("maxHeight", "5%")

  // $.get(url + "/featured.png", function(data){
  //   // console.log(data)
  //     // console.log(data)
  //     })

  // console.log(q)

  // console.log(`Hovering over ${url}`)
  // console.log(event)
}




main()
