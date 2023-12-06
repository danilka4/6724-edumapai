function _1(md){return(
md`# InfoMap`
)}

function _topics_gone_over(){return(
["Spread", "Risk"]
)}

function _chart(EduMap,topics,topics_gone_over){return(
EduMap(topics, topics_gone_over)
)}

function _EduMap(d3,color,width,height,color_border,linkArc,invalidation){return(
function EduMap(nodes_and_links, nodes_visited) {
  const links = nodes_and_links.links;
  const nodes = nodes_and_links.nodes;
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
    .text("")
    .on("mouseleave", leaveTip);

  function leaveTip(event, node) {
    // debugger;
    let clicked_circle = d3.select(this);
    // debugger;
    // clicked_circle.visited = !clicked_node.visited;
    // clicked_circle.attr("fill", (d) => color(d.visited));

    // update visibility
    // isTooltipHidden = !isTooltipHidden;
    isTooltipHidden = true;
    var visibility = isTooltipHidden ? "hidden" : "visible";
    // debugger;
    // load tooltip content (if it changes based on node)
    // loadTooltipContent(node, clicked_circle);

    // place tooltip where cursor was
    return tooltip
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px")
      .style("visibility", visibility);
  }

  // add html content to tooltip
  function loadTooltipContent(node, circle) {
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
      "info" +
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
        var cir = circle;
        // debugger;
        // var currentColor = clickedNode.fill;
        clickedNode.visited = !clickedNode.visited;
        cir.attr("fill", color(clickedNode.visited));
        // var newColor = currentColor === "red" ? "blue" : "red"; // Customize the colors
        // clickedNode.attr("fill", newColor);
        // debugger;
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
    .data([true, false])
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
  // debugger;
  node
    .append("circle")
    // .attr("stroke", "white")
    // .attr("stroke-width", 1.5)
    .attr("r", 10)
    .attr("visited", (d) => d.visited)
    .attr("fill", (d) => color(d.visited))
    .attr("stroke", (d) => color_border(nodes_visited.includes(d.id)))
    .attr("stroke-width", "5px")
    .on("mouseenter", enterNode);

  node
    .append("text")
    .attr("x", -6)
    .attr("y", -15)
    .text((d) => d.id)
    .clone(true)
    .lower()
    .attr("stroke", "white")
    .attr("stroke-width", 3);

  function enterNode(event, node) {
    // debugger;
    let clicked_circle = d3.select(this);
    // debugger;
    // clicked_circle.visited = !clicked_node.visited;
    // clicked_circle.attr("fill", (d) => color(d.visited));

    // update visibility
    // isTooltipHidden = !isTooltipHidden;
    isTooltipHidden = false;
    var visibility = isTooltipHidden ? "hidden" : "visible";
    // debugger;
    // load tooltip content (if it changes based on node)
    loadTooltipContent(node, clicked_circle);

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

  return svg.node();
}
)}

function _hov(){return(
null
)}

function _topics(FileAttachment){return(
FileAttachment("topics@7.json").json()
)}

function _7(topics){return(
topics.nodes.filter((d) => d.id == "Symptoms").visited = true
)}

function _8(topics){return(
topics
)}

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

function _color(d3){return(
d3.scaleOrdinal([true, false], ["#0D0887", "#CC4778"])
)}

function _color_border(d3){return(
d3.scaleOrdinal([true, false], ["#F0F921", "#FFFFFF"])
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
    ["topics@7.json", {url: new URL("./files/41747d0fb7759d4d4a2874d434631d5c5d865a1e4a0acf5d08e1ae3307ec8d883a1381859c89f791bd41ba7a57bb053e99e2db873ad1cbe8a868e06fca094095.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("topics_gone_over")).define("topics_gone_over", _topics_gone_over);
  main.variable(observer("chart")).define("chart", ["EduMap","topics","topics_gone_over"], _chart);
  main.variable(observer("EduMap")).define("EduMap", ["d3","color","width","height","color_border","linkArc","invalidation"], _EduMap);
  main.define("initial hov", _hov);
  main.variable(observer("mutable hov")).define("mutable hov", ["Mutable", "initial hov"], (M, _) => new M(_));
  main.variable(observer("hov")).define("hov", ["mutable hov"], _ => _.generator);
  main.variable(observer("topics")).define("topics", ["FileAttachment"], _topics);
  main.variable(observer()).define(["topics"], _7);
  main.variable(observer()).define(["topics"], _8);
  main.variable(observer("tipcontent")).define("tipcontent", _tipcontent);
  main.variable(observer("linkArc")).define("linkArc", _linkArc);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("color_border")).define("color_border", ["d3"], _color_border);
  main.variable(observer("ho")).define("ho", _ho);
  main.define("initial clicked", _clicked);
  main.variable(observer("mutable clicked")).define("mutable clicked", ["Mutable", "initial clicked"], (M, _) => new M(_));
  main.variable(observer("clicked")).define("clicked", ["mutable clicked"], _ => _.generator);
  main.variable(observer("addTooltips")).define("addTooltips", ["d3","id_generator","mutable clicked","ho","html"], _addTooltips);
  main.variable(observer("id_generator")).define("id_generator", _id_generator);
  return main;
}
