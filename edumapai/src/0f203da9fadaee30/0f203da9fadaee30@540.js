function _1(md){return(
md`# InfoMap`
)}

function _hov(){return(
null
)}

function _topics(FileAttachment){return(
FileAttachment("topics@6.json").json()
)}

function _4(topics){return(
topics.nodes.filter((d) => d.id == "Symptoms").visited = true
)}

function _5(topics){return(
topics
)}

function _graph(addTooltips,ForceGraph,topics,width,invalidation){return(
addTooltips(
  ForceGraph(topics, {
    nodeId: (d) => d.id, // node identifier, to match links
    nodeGroup: (d) => d.group, // group identifier, for color
    nodeTitle: (d) => d.id, // hover text
    width,
    height: 520,
    invalidation // stop when the cell is re-run
  })
)
)}

function _ForceGraph(d3){return(
function ForceGraph(
  {
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
  },
  {
    nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 1.5, // node stroke width, in pixels
    nodeStrokeOpacity = 1, // node stroke opacity
    nodeRadius = 10, // node radius, in pixels
    nodeStrength = -100,
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 1, // link stroke opacity
    linkStrokeWidth = 3, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    invalidation // when this promise resolves, stop the simulation
  } = {}
) {
  // Compute values.
  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W =
    typeof linkStrokeWidth !== "function"
      ? null
      : d3.map(links, linkStrokeWidth);
  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
  links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
  if (linkStrength !== undefined) forceLink.strength(linkStrength);

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter())
    .on("tick", ticked);

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg
    .append("svg:defs")
    .selectAll("marker")
    .data(["end"]) // Different link/path types can be defined here
    .enter()
    .append("svg:marker") // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("fill", linkStroke)
    .attr("fill-opacity", linkStrokeOpacity)
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

  const link = svg
    .append("g")
    .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
    .attr("stroke-opacity", linkStrokeOpacity)
    .attr(
      "stroke-width",
      typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null
    )
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("marker-end", "url(#end)");

  // const link = svg.append("g")
  //   .attr("fill", "none")
  //   .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
  //   .attr("stroke-width", 1.5)
  // .selectAll("path")
  // .data(links)
  // .join("path")
  //   .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);

  const node = svg
    .append("g")
    .attr("fill", nodeFill)
    .attr("stroke", nodeStroke)
    .attr("stroke-opacity", nodeStrokeOpacity)
    .attr("stroke-width", nodeStrokeWidth)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", nodeRadius)
    .call(drag(simulation));

  node
    .append("text")
    .attr("x", -6)
    .attr("y", -15)
    .text((d) => d.id)
    .lower()
    .attr("stroke", "black")
    .attr("stroke-width", 3);

  // const label = svg
  //   .append("g")
  //   .selectAll("text")
  //   .data(nodes)
  //   .join("text")
  //   .text(function (d) {
  //     return d.id;
  //   })
  //   .style("text-anchor", "middle")
  //   .style("fill", "#555")
  //   .style("font-family", "Arial")
  //   .style("font-size", 12);
  // nodes
  //   .append("g")
  //   .selectAll("text")
  //   .data(nodes)
  //   .join("text")
  //   .text((d) => d.id)
  //   .attr("x", 30 + 4)
  //   .attr("y", "0.31em");

  //   .on("mouseover", (event, r) => {
  //     bg = d3.select(event.target).style("fill"); // save the current color of the rect for mouseout
  //     d3.select(event.target).style("fill", "orange"); // Modify SVG DOM
  //     // text.html(r.Name + " " + r.PercentCollegeGrad);
  //     // text.attr("x", xScale(r.Abbrev)); //.attr("y", yScale(r.PercentCollegeGrad));
  //     mutable hov = r; // Export hover selection
  //   })
  //   .on("mouseout", (event, r) => {
  //     d3.select(event.target).style("fill", bg);
  //   });
  // let bg = null;

  if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
  if (L) link.attr("stroke", ({ index: i }) => L[i]);
  if (G) node.attr("fill", ({ index: i }) => color(G[i]));
  if (T) node.append("title").text(({ index: i }) => T[i]);
  if (invalidation != null) invalidation.then(() => simulation.stop());

  function intern(value) {
    return value !== null && typeof value === "object"
      ? value.valueOf()
      : value;
  }

  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
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

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return Object.assign(svg.node(), { scales: { color } });
}
)}

function _8(html){return(
html`
<button id="switchmodes">switchmodes</button>
`
)}

function _chart(topics,d3,width,height,types,color,linkArc,invalidation)
{
  const links = topics.links.map((d) => Object.create(d));
  const nodes = topics.nodes.map((d) => Object.create(d));
  // keep track of if tooltip is hidden or not
  var isTooltipHidden = true;
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("z-index", "10")
    .style("width", "200px")
    //.style("height", "200px")
    .style("background-color", "rgba(230, 230, 230, 0.9)")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .text("");
  // add html content to tooltip
  function loadTooltipContent(node) {
    var htmlContent = "<div>";
    var vis = "";
    if (node.visited) {
      vis = "Unvisit";
    } else {
      vis = "Mark Visited";
    }
    htmlContent +=
      "<h4>" +
      node.id +
      '</h4>\n<p><a href="' +
      node.url +
      '" target="blank">' +
      "cdc info" +
      "</a></p>\n<button name='switchmodes'>" +
      vis +
      // node.visited
      //   ? "Un-visit"
      //   : "Mark Visited"
      "</button>" +
      "</div>";
    // debugger;
    tooltip.html(htmlContent);
    const button = tooltip.select("button[name='switchmodes']");
    if (button) {
      button.on("click", function () {
        var clickedNode = node; // Capture the correct node in a closure
        // debugger;
        // var currentColor = clickedNode.fill;
        clickedNode.visited = !clickedNode.visited;

        // var newColor = currentColor === "red" ? "blue" : "red"; // Customize the colors
        // clickedNode.attr("fill", newColor);

        // // Reset the button text
        var vis = "";
        if (node.visited) {
          vis = "Unvisit";
        } else {
          vis = "Mark Visited";
        }

        d3.select(this).text(vis);
      });
    }
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-400))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("font", "12px sans-serif");

  svg
    .append("defs")
    .selectAll("marker")
    .data(types)
    .join("marker")
    .attr("id", "POINT")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 23)
    .attr("refY", 0)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "black")
    .attr("d", "M0,-5L10,0L0,5");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", "black")
    .attr("marker-end", "url(#POINT)");

  const node = svg
    .append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation));

  node
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", 10)
    .attr("visited", (d) => d.visited)
    .attr("fill", (d) => color(d.visited))
    .on("click", clickNode);

  node
    .append("text")
    .attr("x", -6)
    .attr("y", -15)
    .text((d) => d.id)
    .clone(true)
    .lower()
    .attr("stroke", "white")
    .attr("stroke-width", 3);

  function clickNode(event, node) {
    // debugger;
    let clicked_node = d3.select(this);
    // debugger;
    clicked_node.visited = !clicked_node.visited;
    clicked_node.attr("fill", (d) => color(d.visited));
    // update visibility
    isTooltipHidden = !isTooltipHidden;
    var visibility = isTooltipHidden ? "hidden" : "visible";

    // load tooltip content (if it changes based on node)
    loadTooltipContent(node);

    if (isTooltipHidden) {
      unPinNode(node);
    }

    // place tooltip where cursor was
    return tooltip
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px")
      .style("visibility", visibility);
  }
  function unPinNode(node) {
    node.fx = null;
    node.fy = null;
  }

  const arcRadius = { licensing: 1, suit: 0.5 };
  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  invalidation.then(() => simulation.stop());

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

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  // hover(node, invalidation);

  return svg.node();
}


function _tipcontent(){return(
function tipcontent(d) {
  return `<strong>${d.id}</strong> 
        <br> 
        <strong><a href=${d.url}>${d.url}</a></strong>`;
}
)}

function _linkArc(){return(
function linkArc(d, scale = 1) {
  const r =
    scale * Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
  `;
}
)}

function _height(){return(
600
)}

function _types(topics){return(
Array.from(new Set(topics.nodes.map((d) => d.visited)))
)}

function _color(d3,types){return(
d3.scaleOrdinal(types, d3.schemeCategory10)
)}

function _ho(){return(
(tip, pos, text) => {
  const side_padding = 10;
  const vertical_padding = 5;
  const vertical_offset = 15;

  // Empty it out
  tip.selectAll("*").remove();

  // Append the text
  tip
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("transform", `translate(${pos[0]}, ${pos[1] + 7})`)
    .selectAll("text")
    .data(text)
    .join("text")
    .style("dominant-baseline", "ideographic")
    .text((d) => d)
    .attr("y", (d, i) => (i - (text.length - 1)) * 15 - vertical_offset)
    .style("font-weight", (d, i) => (i === 0 ? "bold" : "normal"));
  const bbox = tip.node().getBBox();

  // Add a rectangle (as background)
  tip
    .append("rect")
    .attr("y", bbox.y - vertical_padding)
    .attr("x", bbox.x - side_padding)
    .attr("width", bbox.width + side_padding * 2)
    .attr("height", bbox.height + vertical_padding * 2)
    .style("fill", "white")
    .style("stroke", "#d3d3d3")
    .lower();
}
)}

function _clicked(){return(
false
)}

function _17(d3,chart){return(
d3.select(chart)
)}

function _addTooltips(d3,id_generator,$0,ho,html){return(
(chart, styles) => {
  const stroke_styles = { stroke: "blue", "stroke-width": 3 };
  const fill_styles = { fill: "blue", opacity: 0.5 };

  // Workaround if it's in a figure
  const type = d3.select(chart).node().tagName;
  let wrapper =
    type === "FIGURE" ? d3.select(chart).select("svg") : d3.select(chart);

  // Workaround if there's a legend....
  const svgs = d3.select(chart).selectAll("svg");
  if (svgs.size() > 1) wrapper = d3.select([...svgs].pop());
  wrapper.style("overflow", "visible"); // to avoid clipping at the edges

  // Set pointer events to visibleStroke if the fill is none (e.g., if its a line)
  wrapper.selectAll("path").each(function (data, index, nodes) {
    // For line charts, set the pointer events to be visible stroke
    if (
      d3.select(this).attr("fill") === null ||
      d3.select(this).attr("fill") === "none"
    ) {
      d3.select(this).style("pointer-events", "visibleStroke");
      if (styles === undefined) styles = stroke_styles;
    }
  });

  if (styles === undefined) styles = fill_styles;

  const tip = wrapper
    .selectAll(".hover")
    .data([1])
    .join("g")
    .attr("class", "hover")
    .style("pointer-events", "none")
    .style("text-anchor", "middle");
  // Add a unique id to the chart for styling
  const id = id_generator();
  // Add the event listeners
  d3.select(chart).classed(id, true); // using a class selector so that it doesn't overwrite the ID
  wrapper.selectAll("title").each(function () {
    // Get the text out of the title, set it as an attribute on the parent, and remove it
    const title = d3.select(this); // title element that we want to remove
    const parent = d3.select(this.parentNode); // visual mark on the screen
    const t = title.text();
    if (t) {
      parent.attr("__title", t).classed("has-title", true);
      title.remove();
    }
    // Mouse events
    parent
      .on("click", function (event) {
        if (!$0.value) {
          const text = d3.select(this).attr("__title");
          const pointer = d3.pointer(event, wrapper.node());
          if (text) tip.call(ho, pointer, text.split("\n"));
          else tip.selectAll("*").remove();

          // Raise it
          d3.select(this).raise();
          // Keep within the parent horizontally
          const tipSize = tip.node().getBBox();
          if (pointer[0] + tipSize.x < -570)
            tip.attr(
              "transform",
              `translate(${-570 + tipSize.width / 2}, ${pointer[1] + 7})`
            );
          else if (pointer[0] + tipSize.width / 2 > wrapper.attr("width"))
            tip.attr(
              "transform",
              `translate(${wrapper.attr("width") - tipSize.width / 2}, ${
                pointer[1] + 7
              })`
            );
          $0.value = true;
        } else {
          $0.value = false;
        }
      })
      .on("pointerenter pointermove", function (event) {
        if (!$0.value) {
          const text = d3.select(this).attr("__title");
          const pointer = d3.pointer(event, wrapper.node());
          if (text) tip.call(ho, pointer, text.split("\n"));
          else tip.selectAll("*").remove();

          // Raise it
          d3.select(this).raise();
          // Keep within the parent horizontally
          const tipSize = tip.node().getBBox();
          if (pointer[0] + tipSize.x < -570)
            tip.attr(
              "transform",
              `translate(${-570 + tipSize.width / 2}, ${pointer[1] + 7})`
            );
          else if (pointer[0] + tipSize.width / 2 > wrapper.attr("width"))
            tip.attr(
              "transform",
              `translate(${wrapper.attr("width") - tipSize.width / 2}, ${
                pointer[1] + 7
              })`
            );
        }
      })
      .on("pointerout", function (event) {
        if (!$0.value) {
          tip.selectAll("*").remove();
          // Lower it!
          d3.select(this).lower();
        }
      });
  });

  // Remove the tip if you tap on the wrapper (for mobile)
  wrapper.on("touchstart", () => tip.selectAll("*").remove());

  // Define the styles
  chart.appendChild(html`<style>
  .${id} .has-title { cursor: pointer;  pointer-events: all; }
  .${id} .has-title:hover { ${Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ")} }`);

  return chart;
}
)}

function _id_generator(){return(
() => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return "a" + S4() + S4();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["topics@6.json", {url: new URL("./files/32242577fe1198eeaec0611ca6367c07928078cbd28409d1d33bf830cf0028fca67cc129e45fd516d1df7db5bb3a488cf6be79381b2b0ed3fb4a9603e73f9755.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.define("initial hov", _hov);
  main.variable(observer("mutable hov")).define("mutable hov", ["Mutable", "initial hov"], (M, _) => new M(_));
  main.variable(observer("hov")).define("hov", ["mutable hov"], _ => _.generator);
  main.variable(observer("topics")).define("topics", ["FileAttachment"], _topics);
  main.variable(observer()).define(["topics"], _4);
  main.variable(observer()).define(["topics"], _5);
  main.variable(observer("graph")).define("graph", ["addTooltips","ForceGraph","topics","width","invalidation"], _graph);
  main.variable(observer("ForceGraph")).define("ForceGraph", ["d3"], _ForceGraph);
  main.variable(observer()).define(["html"], _8);
  main.variable(observer("chart")).define("chart", ["topics","d3","width","height","types","color","linkArc","invalidation"], _chart);
  main.variable(observer("tipcontent")).define("tipcontent", _tipcontent);
  main.variable(observer("linkArc")).define("linkArc", _linkArc);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("types")).define("types", ["topics"], _types);
  main.variable(observer("color")).define("color", ["d3","types"], _color);
  main.variable(observer("ho")).define("ho", _ho);
  main.define("initial clicked", _clicked);
  main.variable(observer("mutable clicked")).define("mutable clicked", ["Mutable", "initial clicked"], (M, _) => new M(_));
  main.variable(observer("clicked")).define("clicked", ["mutable clicked"], _ => _.generator);
  main.variable(observer()).define(["d3","chart"], _17);
  main.variable(observer("addTooltips")).define("addTooltips", ["d3","id_generator","mutable clicked","ho","html"], _addTooltips);
  main.variable(observer("id_generator")).define("id_generator", _id_generator);
  return main;
}
