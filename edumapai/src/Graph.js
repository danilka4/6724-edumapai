import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// source: https://observablehq.com/d/0f203da9fadaee30 

function linkArc(d, scale = 1) {
  const r = scale * Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
  return `M${d.source.x},${d.source.y}A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
}

function Graph({ data, width, height }) {
  const svgRef = useRef();

  function drag(simulation) {
    const dragStartedMap = new Map();
  
    function dragstarted(event, d) {
      if (!event.active && !dragStartedMap.has(d)) {
        simulation.alphaTarget(0.3).restart();
        dragStartedMap.set(d, true);
      }
      d.fx = d.x;
      d.fy = d.y;
    }
  
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
  
    function dragended(event, d) {
      if (!event.active && dragStartedMap.has(d)) {
        simulation.alphaTarget(0);
        dragStartedMap.delete(d);
      }
      d.fx = null;
      d.fy = null;
    }
  
    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }
  
  useEffect(() => {
    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .style('font', '12px sans-serif');

    const link = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(links)
      .join('path');

    const node = svg
      .append('g')
      .attr('fill', 'currentColor')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation));

    node
      .append('circle')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('r', 4);

    node
      .append('text')
      .attr('x', 8)
      .attr('y', '0.31em')
      .text((d) => d.id)
      .clone(true)
      .lower()
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 3);

    simulation.on('tick', () => {
      link.attr('d', linkArc);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });
  }, [data, width, height]);

 

  return (
    <svg ref={svgRef} width={width} height={height}>
      {/* SVG content will be rendered here */}
    </svg>
  );
}

export default Graph;
