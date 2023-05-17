const div = d3.selectAll("div");
var fill = d3.schemeAccent;
  // init canvas
var width =550, height = 550;
var svg = d3.select("#banner").select("svg")
if (svg.empty()) {
    svg = d3.select("#banner").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

}

  // load nodes
  async function load_graph(){
    const data = await d3.json("./miserables.json");
    console.log(data.links)
    return data;
  }



  function get_data(){
    return load_graph().then(d => {make_force(d)})
  }


  function make_force(x){
      var nodes = x.nodes;
      var links = x.links;

    const N = d3.map(nodes, d => d.id)
    console.log(N)
    console.log(links[0])
    var force = d3.forceSimulation(nodes)
        .force("center", d3.forceCenter())
        .force("link", d3.forceLink(links).id( ({index: i}) => N[i]))
        .force("charge", d3.forceManyBody())
        .on("tick", ticked)

     var link = svg.append("g")
          .attr("stroke", "gray")
          .selectAll("line")
          .data(links)
          .join("line");

      var node = svg
        .append("g")
        .selectAll("circle")
          .data(nodes)
        .join("circle")
          .attr("r", 5).call(drag(force))
          .attr("fill", d => {return fill[d.group];})


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
