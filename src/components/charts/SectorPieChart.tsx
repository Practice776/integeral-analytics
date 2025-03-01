
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SectorData {
  name: string;
  value: number;
}

interface SectorPieChartProps {
  data: SectorData[];
  height?: number;
}

const SectorPieChart: React.FC<SectorPieChartProps> = ({ data, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions
    const width = svgRef.current.clientWidth;
    const chartHeight = height;
    const radius = Math.min(width, chartHeight) / 2 * 0.8;

    // Create svg
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', `translate(${width / 2},${chartHeight / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeBlues[9]);

    // Compute the position of each group on the pie
    const pie = d3
      .pie<SectorData>()
      .sort(null)
      .value(d => d.value);

    const data_ready = pie(data);

    // Create the arcs
    const arc = d3
      .arc<d3.PieArcDatum<SectorData>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create the hover arc with a slightly larger radius
    const arcHover = d3
      .arc<d3.PieArcDatum<SectorData>>()
      .innerRadius(0)
      .outerRadius(radius * 1.1);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    // Calculate total for percentage
    const total = d3.sum(data, d => d.value);

    // Build the pie chart with animations
    svg
      .selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        const percentage = ((d.data.value / total) * 100).toFixed(1);
        
        // Highlight the segment
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover)
          .style('opacity', 1);
        
        // Show tooltip
        tooltip
          .style('opacity', 1)
          .html(`<div class="p-2">
                  <div class="font-medium">${d.data.name}</div>
                  <div>Count: ${d.data.value}</div>
                  <div>${percentage}% of total</div>
                </div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        // Return to normal
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc)
          .style('opacity', 0.8);
        
        // Hide tooltip
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add labels
    svg
      .selectAll('text')
      .data(data_ready)
      .enter()
      .append('text')
      .text(d => d.data.name)
      .attr('transform', d => {
        const pos = arc.centroid(d);
        const x = pos[0] * 1.5;
        const y = pos[1] * 1.5;
        return `translate(${x},${y})`;
      })
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', 'currentColor')
      .style('opacity', 0)
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', function(d) {
        // Only show label if the segment is large enough
        return (d.endAngle - d.startAngle > 0.25) ? 1 : 0;
      });

    // Clean up function
    return () => {
      tooltip.remove();
    };
  }, [data, height]);

  return (
    <div className="w-full h-full overflow-hidden">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default SectorPieChart;
