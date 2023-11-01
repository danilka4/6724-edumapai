// // import * as d3 from 'd3';
// function _1(md){return(
// md`# InfoMap`
// )}

// function _topics(FileAttachment){return(
// FileAttachment("topics.json").json()
// )}

// function _3(ForceGraph,topics,width,invalidation){return(
// ForceGraph(topics, {
//   nodeId: (d) => d.id, // node identifier, to match links
//   nodeGroup: (d) => d.group, // group identifier, for color
//   nodeTitle: (d) => d.id, // hover text
//   width,
//   height: 520,
//   invalidation // stop when the cell is re-run
// })
// )}

// function _ForceGraph(d3){return(
// function ForceGraph({
//   nodes, // an iterable of node objects (typically [{id}, …])
//   links // an iterable of link objects (typically [{source, target}, …])
// }, {
//   nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
//   nodeGroup, // given d in nodes, returns an (ordinal) value for color
//   nodeGroups, // an array of ordinal values representing the node groups
//   nodeTitle, // given d in nodes, a title string
//   nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
//   nodeStroke = "#fff", // node stroke color
//   nodeStrokeWidth = 1.5, // node stroke width, in pixels
//   nodeStrokeOpacity = 1, // node stroke opacity
//   nodeRadius = 10, // node radius, in pixels
//   nodeStrength,
//   linkSource = ({source}) => source, // given d in links, returns a node identifier string
//   linkTarget = ({target}) => target, // given d in links, returns a node identifier string
//   linkStroke = "#999", // link stroke color
//   linkStrokeOpacity = 0.6, // link stroke opacity
//   linkStrokeWidth = 3, // given d in links, returns a stroke width in pixels
//   linkStrokeLinecap = "round", // link stroke linecap
//   linkStrength,
//   colors = d3.schemeTableau10, // an array of color strings, for the node groups
//   width = 640, // outer width, in pixels
//   height = 400, // outer height, in pixels
//   invalidation // when this promise resolves, stop the simulation
// } = {}) {
//   // Compute values.
//   const N = d3.map(nodes, nodeId).map(intern);
//   const LS = d3.map(links, linkSource).map(intern);
//   const LT = d3.map(links, linkTarget).map(intern);
//   if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
//   const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
//   const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
//   const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
//   const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

//   // Replace the input nodes and links with mutable objects for the simulation.
//   nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
//   links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

//   // Compute default domains.
//   if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

//   // Construct the scales.
//   const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

//   // Construct the forces.
//   const forceNode = d3.forceManyBody();
//   const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
//   if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
//   if (linkStrength !== undefined) forceLink.strength(linkStrength);

//   const simulation = d3.forceSimulation(nodes)
//       .force("link", forceLink)
//       .force("charge", forceNode)
//       .force("center",  d3.forceCenter())
//       .on("tick", ticked);

//   const svg = d3.create("svg")
//       .attr("width", width)
//       .attr("height", height)
//       .attr("viewBox", [-width / 2, -height / 2, width, height])
//       .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

//   const link = svg.append("g")
//       .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
//       .attr("stroke-opacity", linkStrokeOpacity)
//       .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
//       .attr("stroke-linecap", linkStrokeLinecap)
//     .selectAll("line")
//     .data(links)
//     .join("line");

//   const node = svg.append("g")
//       .attr("fill", nodeFill)
//       .attr("stroke", nodeStroke)
//       .attr("stroke-opacity", nodeStrokeOpacity)
//       .attr("stroke-width", nodeStrokeWidth)
//     .selectAll("circle")
//     .data(nodes)
//     .join("circle")
//       .attr("r", nodeRadius)
//       .call(drag(simulation));

//   if (W) link.attr("stroke-width", ({index: i}) => W[i]);
//   if (L) link.attr("stroke", ({index: i}) => L[i]);
//   if (G) node.attr("fill", ({index: i}) => color(G[i]));
//   if (T) node.append("title").text(({index: i}) => T[i]);
//   if (invalidation != null) invalidation.then(() => simulation.stop());

//   function intern(value) {
//     return value !== null && typeof value === "object" ? value.valueOf() : value;
//   }

//   function ticked() {
//     link
//       .attr("x1", d => d.source.x)
//       .attr("y1", d => d.source.y)
//       .attr("x2", d => d.target.x)
//       .attr("y2", d => d.target.y);

//     node
//       .attr("cx", d => d.x)
//       .attr("cy", d => d.y);
//   }

//   function drag(simulation) {    
//     function dragstarted(event) {
//       if (!event.active) simulation.alphaTarget(0.3).restart();
//       event.subject.fx = event.subject.x;
//       event.subject.fy = event.subject.y;
//     }
    
//     function dragged(event) {
//       event.subject.fx = event.x;
//       event.subject.fy = event.y;
//     }
    
//     function dragended(event) {
//       if (!event.active) simulation.alphaTarget(0);
//       event.subject.fx = null;
//       event.subject.fy = null;
//     }
    
//     return d3.drag()
//       .on("start", dragstarted)
//       .on("drag", dragged)
//       .on("end", dragended);
//   }

//   return Object.assign(svg.node(), {scales: {color}});
// }
// )}

// export default function define(runtime, observer) {
//   const main = runtime.module();
//   function toString() { return this.url; }
//   const fileAttachments = new Map([
//     ["topics.json", {url: new URL("./files/a803e3dfecced6d62ac1983cdd6baa2e6cefe083bc06c5be17ca1ea4484d206986f7f3c3254cc94affb1fa1d6e02faab5bf96a5491b71bacb39a195fa3c5e576.json", import.meta.url), mimeType: "application/json", toString}]
//   ]);
//   main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
//   main.variable(observer()).define(["md"], _1);
//   main.variable(observer("topics")).define("topics", ["FileAttachment"], _topics);
//   main.variable(observer()).define(["ForceGraph","topics","width","invalidation"], _3);
//   main.variable(observer("ForceGraph")).define("ForceGraph", ["d3"], _ForceGraph);
//   return main;
// }
// Import the necessary libraries (D3.js)
import * as d3 from 'd3';

// Define a function to create the force-directed graph
function createForceDirectedGraph(containerId, data) {
  // Create the SVG container
  const width = 640;
  const height = 400;
  const svg = d3.select(containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  // Define your force simulation here, using the 'data' parameter
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter());

  // Create links and nodes using D3 selections
  const link = svg.append('g')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line');

  const node = svg.append('g')
    .selectAll('circle')
    .data(data.nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .call(drag(simulation));

  // Define a tick function to update the positions of nodes and links
  function ticked() {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  // Define the drag behavior for nodes
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
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  // Set up the simulation's tick event
  simulation.on('tick', ticked);

  // Return the SVG node containing the graph
  return svg.node();
}

// Usage example:
const containerId = '#graph-container'; // Replace with the ID or selector of your container element
const data = {
  nodes: [
    { id: 'Node 1' },
    { id: 'Node 2' },
    // Add more nodes as needed
  ],
  links: [
    { source: 'Node 1', target: 'Node 2' },
    // Add more links as needed
  ],
};

// Call the function to create the graph
createForceDirectedGraph(containerId, data);
