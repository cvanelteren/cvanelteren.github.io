import _ from 'lodash'
import g from "./brain_graph.json" assert {type: "json"}


class Graph {
    constructor(node_link){
        this.nodes = node_link["nodes"];
        this.edges = node_link["links"];
        this.radius = 5;
    }

    drawNode(node){
        context.beginPath();
        let x = scalePosX(node.x);
        let y = scalePosY(node.y);
        let color = cmap( scaleColor(node.id) );
        context.moveTo(x, y);
        context.arc(x, y,
                    this.radius,
                    0, 2 * Math.PI);
        context.fillStyle = color;
        context.globalAlpha = 0.75;
        context.strokeStyle = "transparent";
        context.fill();
        context.stroke();
        // context.closePath();
    }

    getNode(node){
        //node is an integer that wel lookup
        let filter =  this.nodes.filter( (target ) => {
            if (target.id == node){
                return target;
            }
        })
        return filter.length > 0  ? filter[0] : 0;
    }

    drawLink(edge){
        let start = this.getNode(edge.source);
        let target = this.getNode(edge.target);
        // console.log(start, target);

        let xStart = scalePosX(start.x);
        let yStart = scalePosY(start.y);

        let xTarget = scalePosX(target.x);
        let yTarget = scalePosY(target.y);



        // context.lineWidth = context.lineWidth + gaussianRandom() * 0.01;
        context.beginPath();
        context.moveTo( xStart, yStart);
        context.lineTo( xTarget, yTarget);

        context.strokeStyle = "lightgray";
        context.globalAlpha = 0.4;
        context.stroke();
        // context.closePath();
    }

    draw() {
        // draw links first for aesthetics
        this.edges.forEach( (edge) => this.drawLink(edge) );
        this.nodes.forEach( (node) => this.drawNode(node) );

    }
}

function gaussianRandom(mean=0, stdev=1) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1]
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


// setup data
let G = new Graph(g);

// setup plot
var base = d3.select("#banner_graph");
let cwidth = 600;
let cheight = 600;

var chart = base.append("canvas")
    .attr("width", cwidth)
    .attr("height", cheight);
var context = chart.node().getContext("2d");

// scalers
const scalePosX = d3.scaleLinear()
      .domain([-1, 1])
      .range([context.canvas.width * 0.1, context.canvas.width * 0.9])
const scalePosY = d3.scaleLinear()
      .domain([-1, 1])
      .range([context.canvas.height * 0.1, context.canvas.height * 0.9])

const scaleColor = d3.scaleLinear()
      .domain([0, G.nodes.length])
      .range([0, 1]);
// const cmap = d3.interpolateRdYlBu;
const cmap = d3.interpolateSpectral;


// animation function
function update(t){
    var t = d3.easeCubic(t / 1000);
    if (t >= 1){
        console.log("done!")
        return true;
    }

    context.clearRect(0, 0,
                      context.canvas.width,
                      context.canvas.height);

    G.nodes.forEach ( (node) => {
        let angle_now = Math.atan2(node.y, node.x);
        let radius_now = Math.sqrt(node.x**2 + node.y**2);

        let angle_target = Math.atan2(node.ty, node.tx) ;
        let radius_target = Math.sqrt(node.tx**2 + node.ty**2);

        let w = Math.exp( -t);
        let new_radius = radius_now * w + (1 - w) * radius_target;
        let new_angle = angle_now * w + (1 - w ) * angle_target

        node.x = new_radius * Math.cos(new_angle);
        node.y = new_radius * Math.sin(new_angle);
        }, t);


    G.draw();
    context.save();
}


function animate() {
    console.log ("here");
    console.log(reset_button.style.opacity);
    if (reset_button.style.opacity == 1){
        reset_button.style.opacity = 0;
        reset_button.classList.toggle("fade");
    }
    // place nodes random on a circle
    G.nodes.forEach( (node) => {
        let angle = Math.random() * 2 * Math.PI;
        node.x = 1 * Math.cos(angle);
        node.y = 1 * Math.sin(angle);
    } )
    return d3.timer(update);
}

// add a reset button
var reset_button = document.getElementById("graph_reset");
reset_button.onclick = animate;
animate();

console.log("terslajkd;lf");

// const simulation = d3.forceSimulation(G.nodes)
//       .force("center", d3.forceCenter(context.canvas.width / 2,
//                                      context.canvas.height / 2)
//              .strength(0.00001)
//             )
//       .force("charge", d3.forceManyBody()
//              .strength(-0.001)
//              .distanceMax(0.05))
//       .force("collision", d3.forceCollide()
//              .radius( (node) => {
//                 return node.radius;
//              } )
//              .strength(-1))
//       .on("tick", () => update());
