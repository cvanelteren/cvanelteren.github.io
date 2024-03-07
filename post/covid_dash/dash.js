
// The svg
var svg = d3.select("#dash"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
console.log("Starting to make the plot")

// create a tooltip
var Tooltip = d3.select("#mdash")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "gray")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


let projection = d3.geoMercator()
    .scale(5000)
    .center([5.291266, 52.132633]) // long lat
    .translate([width / 2, height / 2])



let cmap = d3.interpolateViridis;

async function load_netherlands(){
    // let url = "https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/wfs?request=GetFeature&service=WFS&version=2.0.0&typeName=cbs_gemeente_2021_gegeneraliseerd&outputFormat=json"
    let url = "./nl.json"
    // console.log("Loaded data")
    // return d3.json(url)
  // let url = "./test.json"
  return d3.json(url)

}

// need to json-fy the latest data in a sparse way to enhance speed
async function load_data(){
  // let url = "./data.json" // works
  let url = "./test.json" // does not work
  return d3.json(url)
}


function get_rank(datum){
  // console.log(datum)
  return datum

}

load_netherlands().then(d => {
    console.log("Making dash")
    console.log(d)

      // .range(d3.schemeSpectral[0])

    svg
        .append("g")
        .selectAll("path")
        .data(d.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .style("stroke", "transparent")
        // .style("fill", (e, idx) => {
          // let x = e.properties.deceased
          // return d3.interpolateSpectral(Math.random())
        // })
        .attr("opacity", 1)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("mousemove", mouseMove)
    console.log("done")

});


var bla = 0;
function get_cases(date, name, d, condition){
  // console.log("Getting", date, name)
  var val = 0;
  try{
    val = d[date][name][condition]
  }
  catch(error){

    if (bla <= 1){
      console.log(error)
      console.log(date, name, condition, d[date])
      bla += 1
    }
    // val = Math.random();

  }
  // console.log("here", val, date, name);
  return val;
}


load_data().then( d => {
  // console.log("in data")
  let dates = Object.keys(d)
  let n = dates.length
  let min = new Date(dates[1])
  let max = new Date(dates[n - 1])
  console.log(min, max)


  // console.log("The data looks like")
  // for (k in d){
  //   console.log(k, d[k])
  //   break
  //   if (k >= 1){
  //     break
  //   }
  // }

  // map date to string
  let date_map = {}
  var date
  for (idx in dates){
    date = new Date(dates[idx])
    date_map[date] = dates[idx]
  }

  function slider_change(value, date, date_map, data){
      if (value != date){
          value = date
          // console.log("Slider changed to", date)
          var fdate = Object.keys(date_map).filter(tmp => {
            var delta = new Date(value).getTime() - new Date(tmp).getTime()
            let counter = 1000 * 3600 * 24 // milliseconds per day
            delta /= counter
            // filter outwithin 31 days the event
            if (Math.abs(delta) <= 31){
              return tmp
            }
          })
          // console.log(fdate)
          if (fdate.length > 0){
            // console.log("Filtered date", fdate)
            update(date_map[fdate[0]], data)
        }
      }
    return value;
  }

  var sliderSimple = d3
    .sliderBottom()
    .min(min)
    .max(max)
    .width(300)
    .ticks(10)
    .step(1)
    // .displayValue(false)
    .default(min)
      .on("start", date => {slider_change(this.value, date,
                                         date_map, d)})
    .on('onchange', date => {
      this.value = slider_change(this.value, date,
                                date_map, d)
      })

  function update(date, data){
    // console.log("Updating on", data[date])
    var cond = "Deceased"
    // cond = "total_ranked"

    var z = Object.values(data[date]).map(e => {
      return e[cond]})

    // console.log("For ", date, "max is ", Z)

    let r = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    const quantile = d3.scaleQuantize()
          // .range([0, 1])
          .domain(d3.extent(z))
          .range(r) // pass the entire dataset

    // console.log(d3.extent(z))
    svg
      .selectAll("path")
      .style("fill", e => {
        let statnaam = e.properties.statcode
        let x = get_cases(date, statnaam, data,cond)
        return cmap(quantile(x))
        }
      )
    }

  var gSimple = d3
      .select("#dash-slider")
      .append("svg")
      .attr("width", width)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(100, 30)")
      .call(sliderSimple)
})


function mouseOver(data){
    // console.log("inside mouseOver")
    svg.selectAll("path")
        .transition()
        .duration(100)
        // .style("fill", "blue")
        .style("opacity", 0.2)

    d3.select(this)
        .transition()
        .duration(100)
        .style("opacity", 1)
        .style("stroke-width", 1)
        .style("stroke", "black")

  // update tooltip
  Tooltip
      .style("opacity", 1)

}

function mouseLeave(data){
    // console.log("inside mouseLeave")
    svg.selectAll("path")
        .transition()
        .duration(100)
        .style("stroke", "transparent")
        .style("opacity", 1)

    d3.select(this)
        .transition()
        .duration(100)
        .style("stroke", "transparent")
        .style("opacity", 1)
        // .style("fill", "green")

  // update tooltip
  Tooltip
      .style("opacity", 0)

}


let mouseMove = function(event, d) {
  Tooltip
      .html(`${d.properties.statnaam}`)
      .style("left", event.pageX + "px")
      .style("top", event.pageY + "px")
  }



