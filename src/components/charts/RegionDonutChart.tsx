
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RegionData {
  name: string;
  value: number;
}

interface RegionDonutChartProps {
  data: RegionData[];
  height?: number;
}

const RegionDonutChart: React.FC<RegionDonutChartProps> = ({ data, height = 300 }) => {
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
    const color = d3.scaleOrdinal(d3.schemeBlues[Math.max(9, data.length)]);

    // Compute the position of each group on the pie
    const pie = d3
      .pie<RegionData>()
      .sort(null)
      .value(d => d.value);

    const data_ready = pie(data);

    // Create the arcs
    const arc = d3
      .arc<d3.PieArcDatum<RegionData>>()
      .innerRadius(radius * 0.5) // This creates the donut effect
      .outerRadius(radius);

    // Create the hover arc with a slightly larger radius
    const arcHover = d3
      .arc<d3.PieArcDatum<RegionData>>()
      .innerRadius(radius * 0.5)
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

    // Build the donut chart with animations
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

    // Add center text
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '1.2rem')
      .attr('font-weight', 'bold')
      .attr('fill', 'currentColor')
      .style('opacity', 0)
      .text('Regions')
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', 1);

    // Add legend
    const legendRectSize = 12;
    const legendSpacing = 4;
    const legendHeight = legendRectSize + legendSpacing;
    
    // Only show top 6 regions in legend to avoid clutter
    const legendData = [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    
    const legend = svg
      .selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        const height = legendHeight + 5;
        const offset = height * legendData.length / 2;
        const x = radius + 20;
        const y = (i * height) - offset;
        return `translate(${x},${y})`;
      })
      .style('opacity', 0)
      .transition()
      .delay((d, i) => 800 + i * 100)
      .duration(500)
      .style('opacity', 1);

    legend
      .append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', (d, i) => color(i.toString()) as string)
      .style('stroke', (d, i) => color(i.toString()) as string);

    legend
      .append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .style('font-size', '10px')
      .style('fill', 'currentColor')
      .text(d => {
        if (d.name.length > 15) {
          return d.name.substring(0, 15) + '...';
        }
        return d.name;
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

export default RegionDonutChart;
