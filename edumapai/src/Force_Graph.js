function _1(md){return(
    md`# InfoMap`
    )}
    
    function _hov(){return(
    null
    )}
    
    function _topics(FileAttachment){return(
    FileAttachment("topics@5.json").json()
    )}
    
    function _4(addTooltips,ForceGraph,topics,width,invalidation){return(
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
    
    function _chart(topics,d3,width,height,types,color,location,linkArc,invalidation)
    {
      const links = topics.links.map((d) => Object.create(d));
      const nodes = topics.nodes.map((d) => Object.create(d));
    
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
    
      // Per-type markers, as they don't inherit styles.
      svg
        .append("defs")
        .selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", (d) => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");
    
      const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", (d) => color(d.type))
        .attr("marker-end", (d) => `url(${new URL(`#arrow-${d.type}`, location)})`);
    
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
        .attr("r", 10);
    
      node
        .append("text")
        .attr("x", -6)
        .attr("y", -15)
        .text((d) => d.id)
        .clone(true)
        .lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);
    
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
    Array.from(new Set(topics.nodes.map(d => d.type)))
    )}
    
    function _color(d3,types){return(
    d3.scaleOrdinal(types, d3.schemeCategory10)
    )}
    
    function _hover(){return(
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
    
    function _addTooltips(d3,id_generator,$0,hover,html){return(
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
              if (text) tip.call(hover, pointer, text.split("\n"));
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
              if (text) tip.call(hover, pointer, text.split("\n"));
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
        ["topics@5.json", {url: new URL("./files/83c769164d66ef890ce4bfc090e4a9fc802282047a1e639dc0ad26a0685a05e3e4a47fa03f4bc5bccdddb394551efd0b53dc8442788415289919c7983efa0f4a.json", import.meta.url), mimeType: "application/json", toString}]
      ]);
      main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
      main.variable(observer()).define(["md"], _1);
      main.define("initial hov", _hov);
      main.variable(observer("mutable hov")).define("mutable hov", ["Mutable", "initial hov"], (M, _) => new M(_));
      main.variable(observer("hov")).define("hov", ["mutable hov"], _ => _.generator);
      main.variable(observer("topics")).define("topics", ["FileAttachment"], _topics);
      main.variable(observer()).define(["addTooltips","ForceGraph","topics","width","invalidation"], _4);
      main.variable(observer("ForceGraph")).define("ForceGraph", ["d3"], _ForceGraph);
      main.variable(observer("chart")).define("chart", ["topics","d3","width","height","types","color","location","linkArc","invalidation"], _chart);
      main.variable(observer("linkArc")).define("linkArc", _linkArc);
      main.variable(observer("height")).define("height", _height);
      main.variable(observer("types")).define("types", ["topics"], _types);
      main.variable(observer("color")).define("color", ["d3","types"], _color);
      main.variable(observer("hover")).define("hover", _hover);
      main.define("initial clicked", _clicked);
      main.variable(observer("mutable clicked")).define("mutable clicked", ["Mutable", "initial clicked"], (M, _) => new M(_));
      main.variable(observer("clicked")).define("clicked", ["mutable clicked"], _ => _.generator);
      main.variable(observer("addTooltips")).define("addTooltips", ["d3","id_generator","mutable clicked","hover","html"], _addTooltips);
      main.variable(observer("id_generator")).define("id_generator", _id_generator);
      return main;
    }