
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CountryData {
  country: string;
  count: number;
}

interface CountryMapChartProps {
  data: CountryData[];
  height?: number;
}

const CountryMapChart: React.FC<CountryMapChartProps> = ({ data, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create svg
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort data in descending order
    const sortedData = [...data].sort((a, b) => b.count - a.count);

    // X scale
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count) as number])
      .range([0, width]);

    // Y scale
    const y = d3
      .scaleBand()
      .domain(sortedData.map(d => d.country))
      .range([0, chartHeight])
      .padding(0.3);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    svg
      .append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('font-size', '10px');

    // Add X axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', chartHeight + margin.bottom - 5)
      .text('Count')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

    // Create gradient color scale
    const colorScale = d3
      .scaleSequential()
      .domain([0, sortedData.length - 1])
      .interpolator(d3.interpolateBlues);

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
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.country) as number)
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .attr('fill', (d, i) => colorScale(i))
      .attr('rx', 2)
      .on('mouseover', function(event, d) {
        // Highlight the bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);
        
        // Show tooltip
        tooltip
          .style('opacity', 1)
          .html(`<div class="p-2">
                  <div class="font-medium">${d.country}</div>
                  <div>Count: ${d.count}</div>
                </div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function() {
        // Return to normal
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1);
        
        // Hide tooltip
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('width', d => x(d.count));

    // Add count labels
    svg
      .selectAll('.label')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => (y(d.country) as number) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem')
      .style('opacity', 0)
      .text(d => d.count)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 400)
      .style('opacity', 1);

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

export default CountryMapChart;
