(function(){

var world_width = 400,
	world_height = 400,
	controlbox_width = 400,
	controlbox_height = 400,
	n_grid_x = 12,
	n_grid_y = 12
	margin = 10;
	
var display = d3.selectAll("#cxpbox_come-together_display").append("canvas")
	.attr("width",world_width)
	.attr("height",world_height)
	.attr("class","explorable_display").style("border-width","2px")

var context = display.node().getContext("2d");
		
var controls = d3.selectAll("#cxpbox_come-together_controls").append("svg")
	.attr("width",controlbox_width)
	.attr("height",controlbox_height)
	.attr("class","explorable_widgets")	
	
var g = widget.grid(controlbox_width,controlbox_height,n_grid_x,n_grid_y);

/*controls.selectAll(".grid").data(g.lattice()).enter().append("circle")
	.attr("class","grid")
	.attr("transform",function(d){
		return "translate("+d.x+","+d.y+")"
	})
	.attr("r",1)
	.style("fill","black")
	.style("stroke","none")*/

//fixed parameters 
	
var pulse_T = 2,
	N = 3000,
	agentsize = 2,
	M = 80,
	c0 = 1,
	dt=0.1;
	
var pixel_width = world_width / M;
var pixel_height = world_height / M;	
		

// this are the default values for the slider variables

var def_D_c = 0.64,
	def_gamma_c = -1.13,
	def_pacemaker_T = 40;

var def_cmax = 200,
	def_recovery_T = 20,
	def_movement_threshold = 15,
	def_activation_threshold = 9.15,
	def_speed = 0.3,
	def_noise = 0.1;


var playblock = g.block({x0:2,y0:10,width:0,height:0});
var buttonblock = g.block({x0:1,y0:7.5,width:2,height:0}).Nx(2);
var radioblock = g.block({x0:8,y0:3,width:0,height:3});
var sliderblock = g.block({x0:5.5,y0:1,width:6,height:10}).Ny(8);
var toggleblock = g.block({x0:0.5,y0:1,width:0,height:4.5}).Ny(5);	
// here are the buttons

var playpause = { id:"b1", name:"", actions: ["play","pause"], value: 0};
var back = { id:"b2", name:"", actions: ["back"], value: 0};
var reset = { id:"b3", name:"", actions: ["rewind"], value: 0};

var playbutton = [
	widget.button(playpause).size(g.x(3)).symbolSize(0.6*g.x(3)).update(runpause)
]

var buttons = [
	widget.button(back).update(resetsystem),
	widget.button(reset).update(resetparameters)
]

var D_c = {id:"D_c", name: "cAMP diffusion", range: [0,1], value: def_D_c};
var gamma_c = {id:"gamma_c", name: "cAMP life-time", range: [0,-2], value: def_gamma_c};
var cmax = {id:"cmax", name: "cAMP pulse strength", range: [100,300], value: def_cmax};
var recovery_T = {id:"recovery_T", name: "recovery time", range: [10,40], value: def_recovery_T};
var movement_threshold = {id:"movement_threshold", name: "movement threshold", range: [2,20], value: def_movement_threshold};
var activation_threshold = {id:"activation_threshold", name: "activation threshold", range: [2,20], value: def_activation_threshold};
var speed = {id:"speed", name: "responsiveness", range: [0.1,0.5], value: def_speed};
var noise = {id:"noise", name: "random movement", range: [0,0.5], value: def_noise};


var sliderwidth = sliderblock.w(),
	handleSize = 12, 
	trackSize = 8;

var slider = [
	
	widget.slider(movement_threshold).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),	widget.slider(activation_threshold).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),	
	widget.slider(D_c).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(gamma_c).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(cmax).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(recovery_T).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),	
	widget.slider(noise).width(sliderwidth).trackSize(trackSize).handleSize(handleSize),
	widget.slider(speed).width(sliderwidth).trackSize(trackSize).handleSize(handleSize)
]

// toggles

var hide_agents = {id:"hide_agents", name: "hide cells",  value: false};
var hide_cAMP = {id:"hide_cAMP", name: "hide cAMP",  value: false};
var coloragents = {id:"coloragents", name: "show cell state",  value: false};
var advanced = {id:"advanced", name: "advanced settings",  value: false};
var paceoff = {id:"paceoff", name: "switch off pacemaker",  value: false};


var toggles = [
	widget.toggle(advanced).label("right").update(moresliders),
	widget.toggle(paceoff).label("right").update(pacemaker),
	widget.toggle(coloragents).label("right").update(setcolor),
	widget.toggle(hide_cAMP).label("right").update(draw),
	widget.toggle(hide_agents).label("right").update(draw)
]
	
// darkness parameters

var pb = controls.selectAll(".button .playbutton").data(playbutton).enter().append(widget.buttonElement)
	.attr("transform",function(d,i){return "translate("+playblock.x(0)+","+playblock.y(i)+")"});	

var bu = controls.selectAll(".button .others").data(buttons).enter().append(widget.buttonElement)
	.attr("transform",function(d,i){return "translate("+buttonblock.x(i)+","+buttonblock.y(0)+")"});	

var spsl = controls.selectAll(".slider").data(slider).enter().append(widget.sliderElement)
	.attr("transform",function(d,i){return "translate("+sliderblock.x(0)+","+sliderblock.y(i)+")"});

var tog = controls.selectAll(".toggle").data(toggles).enter().append(widget.toggleElement)
	.attr("transform",function(d,i){return "translate("+toggleblock.x(0)+","+toggleblock.y(i)+")"});

//var rad = controls.selectAll(".radio .input").data(radios).enter().append(widget.radioElement)
//	.attr("transform",function(d,i){return "translate("+radioblock.x(0)+","+radioblock.y(0)+")"});	


var X = d3.scaleLinear().domain([0,M-1]).range([0,world_width-pixel_width]);
var Y = d3.scaleLinear().domain([0,M-1]).range([0,world_height-pixel_height]);
var C = d3.scaleSqrt().domain([0,cmax.value]).range(["#F6FFFE","rgb(0,0,255)"])
var C_agents = d3.scaleOrdinal().domain([0,1,2]).range(["rgb(0,0,0,0.7)","rgba(0,0,0,0.7)","rgba(0,0,0,0.7)"])
		
/////////////////////////
// this is the agent data	
/////////////////////////
var G = lattice.square(M);
var sites = G.nodes;

sites.forEach(function(s){
	s.cAMP=0;
})

//sites[M*(M)/2+(M)/2].cAMP=cmax.value;

var agents = d3.range(N).map(function(d,i){
	return {
		type: i == N-1 ? "pacemaker" : "normal",
		"index":i,
		x:i == N-1 ? M/2 : (M)*Math.random(),
		y:i == N-1 ? M/2 : (M)*Math.random(),
		state:i == N-1 ? 1 : 0,
		rate: Math.random(),
		clock:0
	}
})

function pacemaker(){
	if (paceoff.value == true){
		agents.forEach(function(d){
			d.type="normal"
		})
		
	} else {
		agents.forEach(function(d,i){
			d.type = i == N-1 ? "pacemaker" : "normal";
			if (i==N-1) {d.state=1}
		})
	}
}

// timer variable for the simulation

var tick=0;
moresliders()
draw()

function setcolor(){
	if(coloragents.value)
	{C_agents.range(["rgba(150,150,150,.7)","darkred","rgba(0,0,0,0.7)"])}
	else 
	{C_agents.range(["rgb(0,0,0,0.7)","rgba(0,0,0,0.7)","rgba(0,0,0,0.7)"])}

	draw()
}

function draw_c(){
	
	sites.forEach(function(d){
		context.fillStyle=C(d.cAMP);
		context.strokeStyle = "black";
		context.fillRect(X(d.x), Y(d.y), pixel_width, pixel_height);
	})
		
}

function draw_nothing(){
	
	sites.forEach(function(d){
		context.fillStyle="rgb(230,230,230)";
		context.strokeStyle = "black";
		context.fillRect(X(d.x), Y(d.y), pixel_width, pixel_height);
	})
		
}

function draw_agents(){
	agents.forEach(function(d){
		context.beginPath();
		context.fillStyle=d.type == "pacemaker" ? "red" : C_agents(d.state);
		var factor = d.type == "pacemaker" && d.state==1 ? 2 : 1
	  	context.arc(X(d.x),Y(d.y),factor*agentsize,0,2*Math.PI);
	 
	  context.fill();
	
	})
}

function draw(){
	if (!hide_cAMP.value) {draw_c()} else {draw_nothing()};
	if (!hide_agents.value) {	draw_agents()}

}


function diffuse_cAMP(){
	sites.forEach(function(d){
			d.dcAMP = 
			D_c.value * dt * ( -d.neighbors.length*d.cAMP + d3.sum(d.neighbors,function(x){return x.cAMP}));		
	})	
	sites.forEach(function(d){
		d.cAMP += d.dcAMP;
		d.cAMP = d.cAMP < 0 ? 0 : d.cAMP
		d.cAMP = d.cAMP * (1-Math.pow(10,gamma_c.value));
	})
	
}
function iterate_cAMP(){
	diffuse_cAMP()
	diffuse_cAMP()
	diffuse_cAMP()
	diffuse_cAMP()	
	sites.forEach(function(d){
		d.cAMP = d.cAMP * (1-Math.pow(10,gamma_c.value));
	})
	
}

function wiggle_agents(){
	agents.forEach(function(a){
		var theta = Math.random()*2*Math.PI;
		var dx = noise.value*Math.cos(theta)
		var dy = noise.value*Math.sin(theta)
		var x_new = (a.x + dx);
		var y_new = (a.y + dy);
		
		if (x_new < 0 || x_new > M) dx *= -1;
		if (y_new < 0 || y_new > M) dy *= -1;
		a.x += dx;
		a.y += dy;
	})

}


function activate(){
	var susceptible = agents.filter(function(d){return d.state==0 && d.type == "normal"});
	susceptible.forEach(function(a){
		var ix = c2l(Math.floor(a.x),Math.floor(a.y),M);
		let local_c = sites[ix].cAMP;
		if(local_c > activation_threshold.value){
			a.state = 1;
			a.stepped = false;		
		}
	})
}

function recover(){
	var active = agents.filter(function(d){return d.state==1 });
	active.forEach(function(a){
		if (a.clock>10){
			a.state = 2;
		}
	})
}


function sensitize(){
	var recovered = agents.filter(function(d){return d.state==2 });
	recovered.forEach(function(a){
		if (a.clock>recovery_T.value){
			a.state = a.type == "pacemaker" ? 1 : 0;
			a.clock = 0;
		}
	})
}

function chemotax(){
	
	var movers = agents.filter(function(a){
		return sites[c2l(Math.floor(a.x),Math.floor(a.y),M)].cAMP > movement_threshold.value && a.stepped == false && a.state==1 
	})

	movers.forEach(function(a){
		var nn = sites[c2l(Math.floor(a.x),Math.floor(a.y),M)].neighbors;
		d3.shuffle(nn);
		var target = d3.greatest(nn, a => a.cAMP);

		// var target = d3.mean(nn,a => a.cAMP);
		// target = nn.filter(a => {return target - 0.1 < a.cAMP <= target});
		// if (target.length > 1){
		// 	d3.shuffle(target)
		// 	target = target[0]
		// }

		var dx = target.x + 0.5 - a.x
		var dy = target.y + 0.5 - a.y
		a.x += speed.value * dx;
		a.y += speed.value * dy;
		a.stepped = true;
	})
	
}

function pulse(){
	var active = agents.filter(function(d){return d.state==1});
	active.forEach(function(a){
		sites[c2l(Math.floor(a.x),Math.floor(a.y),M)].cAMP=cmax.value
	})
}

// functions for the action buttons

function moresliders(){
	
	if (advanced.value==true){
		
		spsl.transition().style("opacity",function(d,i){
			return 1
		}).select(".track-overlay").style("pointer-events","all")

	} else {
		spsl.transition().style("opacity",function(d,i){
			return i>3 ? 1 : 0
		}).select(".track-overlay").style("pointer-events",function(d,i){
			return i>3 ? "all" : "none"
		})
	}
}

function runpause(d){ 
	if (d.value == 1) {
		t = d3.interval(runsim,0)
	} else {
		t.stop()
	}
}

function resetsystem(){

	tick=0;
	sites.forEach(function(s){
		s.cAMP=0;
	})
	agents.forEach(function(d){
		
	})
	agents = d3.range(N).map(function(d,i){
		return {
			type: i == N-1 ? "pacemaker" : "normal",
			"index":i,
			x:i == N-1 ? M/2 : (M)*Math.random(),
			y:i == N-1 ? M/2 : (M)*Math.random(),
			state:i == N-1 ? 1 : 0,
			clock:0
		}
	})
	if (paceoff.value==1){
		toggles[1].click()
	}
	draw()
}

function resetparameters(){
	slider[0].click(def_movement_threshold)
	slider[1].click(def_activation_threshold)
	slider[2].click(def_D_c)
	slider[3].click(def_gamma_c)
	slider[4].click(def_cmax)
	slider[5].click(def_recovery_T)
	slider[6].click(def_noise)
	slider[7].click(def_speed)
}

function runsim(){
	
	tick++;
//	if (tick % pacemaker_T.value == 0){
//		sites[M*(M)/2+(M)/2].cAMP=cmax.value;
//	}
	
	
	wiggle_agents();
	activate();
	recover();
	sensitize();
	agents.filter(function(d){return d.state>0}).forEach(function(d){d.clock+=1})
	//chemotax();
	pulse();
	iterate_cAMP();
	chemotax();
	
	
	
	draw()
	
}

function c2l(x,y,N){

	return y*N+x;
}

function l2c(l,N){
	return {x:l % N,y:Math.floor(l/N)}
}


})()
