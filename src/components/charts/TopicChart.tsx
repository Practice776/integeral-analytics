
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TopicData {
  name: string;
  value: number;
}

interface TopicChartProps {
  data: TopicData[];
  height?: number;
}

const TopicChart: React.FC<TopicChartProps> = ({ data, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions and margins
    const margin = { top: 30, right: 20, bottom: 50, left: 100 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create svg
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort data in descending order by value
    const sortedData = [...data].sort((a, b) => a.value - b.value);

    // X scale
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number])
      .nice()
      .range([0, width]);

    // Y scale
    const y = d3
      .scaleBand()
      .domain(sortedData.map(d => d.name))
      .range([0, chartHeight])
      .padding(0.2);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('dy', '0.35em');

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // X axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', chartHeight + margin.bottom - 10)
      .text('Count')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

    // Create color scale
    const colorScale = d3
      .scaleSequential()
      .domain([0, sortedData.length])
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
      .attr('y', d => y(d.name) as number)
      .attr('height', y.bandwidth())
      .attr('width', 0)
      .attr('fill', (d, i) => colorScale(i))
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(`<div class="p-2">
                  <div class="font-medium">${d.name}</div>
                  <div>Count: ${d.value}</div>
                </div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('width', d => x(d.value));

    // Add value labels
    svg
      .selectAll('.label')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.value) + 5)
      .attr('y', d => (y(d.name) as number) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem')
      .attr('opacity', 0)
      .text(d => d.value)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 400)
      .attr('opacity', 1);

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

export default TopicChart;
