function main(){
  const margin = {top: 10,
                  right: 30,
                  bottom: 30,
                  left: 60};
  const width = 700 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  // create canvas and select the "graphics"
  var svg = d3.select("#first_plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("style", "max-width: 100%; height: 100%; height: intrinsic;")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

 // make scatter
  var data = Array.from({length: 1000}, (_, idx) => {
    return {x: idx * 0.1/ ( 2 * 3.141592 ), y:  (Math.sin(idx * 0.1/ ( 2 * 3.141592 )) +  1 * Math.random())}
    });


  // construct axes
  const x = d3.scaleLinear()
      .domain([0, 10])
      .range([ 0, width ]);

  const y = d3.scaleLinear()
        .domain([ -2, 2])
      .range([ height, 0 ]);

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

  var scatter = svg.append("g")
    .selectAll("dot")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.x))
    .attr("cy", d => y(d.y))
    .attr("r", 5)
    .style("fill", "#729B79")
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)
    .on("mousemove", mouseMove)


// add axes
svg.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(d3.axisBottom(x));

 svg.append("g")
    .call(d3.axisLeft(y));



};


$().ready(function() {
    $().html(main());

})

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

let mouseMove = function(event, d) {
  Tooltip
      .html(`x: ${d.x} <br> y: ${d.y}`)
      .style("left", event.pageX + "px")
      .style("top", event.pageY + "px")
}
