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
//POSSIBILITY OF  SUCH DAMAGE. THIS SOFTWARE  IS PROVIDED BY
//THE  COPYRIGHT HOLDERS  AND CONTRIBUTORS  "AS IS"  AND ANY
//EXPRESS OR IMPLIED WARRANTIES,  INCLUDING, BUT NOT LIMITED
//TO, THE IMPLIED WARRANTIES  OF MERCHANTABILITY AND FITNESS
//FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
//THE  COPYRIGHT HOLDER  OR CONTRIBUTORS  BE LIABLE  FOR ANY
//DIRECT,  INDIRECT,  INCIDENTAL,   SPECIAL,  EXEMPLARY,  OR
//CONSEQUENTIAL  DAMAGES  (INCLUDING,  BUT NOT  LIMITED  TO,
//PROCUREMENT OF SUBSTITUTE GOODS  OR SERVICES; LOSS OF USE,
//DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
//AND  ON  ANY THEORY  OF  LIABILITY,  WHETHER IN  CONTRACT,
//STRICT  LIABILITY,   OR  TORT  (INCLUDING   NEGLIGENCE  OR
//OTHERWISE)  ARISING IN  ANY WAY  OUT  OF THE  USE OF  THIS
//SOFTWARE,  EVEN  IF ADVISED  OF  THE  POSSIBILITY OF  SUCH
//DAMAGE.

const fetch = require("node-fetch")
const cheerio = require("cheerio")
// import {global} from "./node_modules/node-fetch/browser.js"
// import {cheerio} from "./node_modules/cheerio/lib/cheerio.js"
// var fetch = require('node-fetch');
// var json = require("json")


// var cheerio = require('cheerio');
// var URL = require('url-parse');

var START_URL = "https://cvanelteren.github.io/";
var MAX_PAGES_TO_VISIT = 5;

var queue = [];
var visited = [];
var graph = {nodes : [], links: [], directed: false, multigraph: false, graph: {}};

var nodes = new Set()
var links = new Set()
var page;
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;
var depth = 10

var counter = 0;

var graph_seen = []


// make_graph();

export async function make_graph(){
    queue.push(START_URL);
    await crawl(queue, visited, graph)
    console.log(visited, queue, graph)
    // console.log(graph)
    let x = Array.from(nodes, d => {return {id: d}})
    let y = Array.from(links)
    let data = {nodes: x, links: y}
    // let data = JSON.stringify(g, null, 2)
    // console.log(data.nodes)


    // fs.writeFile("test.json", data, e => {
    //     if (e) throw e;
    //     console.log('Data written to file');
    // })

    return data

}

function add_url(array, url){
    array.push(url);
}

function add_edge(x, y){
    nodes.add(x)
    nodes.add(y)
    let link = {source: x, target: y, value: 1}
    links.add(link)
}

async function get_local_links(response){
    var body = await response.text()
    var pageContent = cheerio.load(body);
    var relativeLinks = await pageContent("a[href^='/']");

    var url;
    console.log("Found " + relativeLinks.length + " relative links on page");
    const result = await relativeLinks.map((idx, link) => {
        url = baseUrl + pageContent(link).attr("href");
        if (!(url in visited) && !(url in queue) && !(url.includes("tag"))){
            // console.log(`Adding ${url} ${queue.length}`)
            add_url(queue, url);
            add_edge(page, url)
        }
    });
}

async function crawl(queue, visited, graph){
    if (counter > depth){
        return graph
    }
    counter += 1;
    if (queue.length == 0){
        console.log("Queue is empty!");
        return queue;
    }

    page = queue.pop();
    if (page in visited){
        console.log(`${page} already visited`);
        return queue;
    }
    add_url(visited, page);
    console.log("Looking for local links")
    let options = {method: 'GET'}
    const result = await fetch(page, options).then(get_local_links);
    // console.log(result)
    // console.log(`At the end with ${queue.length}`)
    // return crawl(queue, visited, graph)
    return crawl(queue, visited, graph)
}


