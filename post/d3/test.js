const div = d3.selectAll("div");

  // init canvas
var width =1200, height = 600;
var svg = d3.select("#banner").select("svg")
if (svg.empty()) {
    svg = d3.select("#banner").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

}


// load nodes
async function load_nodes_with(id){
    const data = await d3.csv("nodes.csv");
    console.log("Loading nodes with " + id)
    return data.map(d => {
        // if (d["id"] == id)
            return {name: d["name"]}
    })
    // })
}

// load links
async function load_edges_with(id){
    console.log("Loading edges with " + id)
    const data = await d3.csv("edges.csv")
    return data.map(d => {
        return {source: d["source"],  target: d["target"]}
    })
}


function get_data(){
        const id = 0
        return Promise.all([ load_nodes_with(id), load_edges_with(id) ]).then( d => make_force(d))
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

  function make_force(x){
      var nodes = x[0];
      var links = x[1];

    const N = d3.map(nodes, d => d.name)
    var force = d3.forceSimulation(nodes)
        .force("center", d3.forceCenter())
        .force("link", d3.forceLink(links).id( ({index: i}) => N[i]))
        .force("charge", d3.forceManyBody())
        .on("tick", ticked)

      var node = svg
        .append("g")
        .selectAll("circle")
        .attr("fill", "green")
        .data(nodes)
        .join("circle")
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .attr("r", 5).call(drag(force));

      var link = svg.append("g")
          .attr("stroke", "green")
          .selectAll("line")
          .data(links)
          .join("line");

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

    }
$().ready(function() {
    $().html(get_data());
})

let mouseOver = function(d) {
  d3.selectAll("circle")
    .transition()
    .duration(200)
    .style("opacity", .5)
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("fill", "black")
}

let mouseLeave = function(d) {
  d3.selectAll("circle")
    .transition()
    .duration(200)
    .style("opacity", .8)
  d3.select(this)
    .transition()
    .duration(200)
    .style("fill", "transparent")
}
