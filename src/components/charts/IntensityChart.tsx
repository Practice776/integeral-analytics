
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { IntensityData } from '../../services/api';

interface IntensityChartProps {
  data: IntensityData[];
  height?: number;
}

const IntensityChart: React.FC<IntensityChartProps> = ({ data, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions and margins
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create svg
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.intensity.toString()))
      .range([0, width])
      .padding(0.2);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count) as number * 1.1])
      .nice()
      .range([chartHeight, 0]);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('dy', '0.35em');

    // Add X axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', chartHeight + margin.bottom - 10)
      .text('Intensity')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // Add Y axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -chartHeight / 2)
      .text('Count')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    // Add bars with animation
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.intensity.toString()) as number)
      .attr('width', x.bandwidth())
      .attr('y', chartHeight)
      .attr('height', 0)
      .attr('fill', '#228be6')
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`<div class="p-2">
                  <div class="font-medium">Intensity: ${d.intensity}</div>
                  <div>Count: ${d.count}</div>
                </div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.count))
      .attr('height', d => chartHeight - y(d.count));

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

export default IntensityChart;
