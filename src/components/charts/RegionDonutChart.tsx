
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RegionData } from '../../services/api';

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

    // Set dimensions and margins
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(width, chartHeight) / 2;

    // Create svg
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${width / 2 + margin.left},${chartHeight / 2 + margin.top})`);

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create pie generator
    const pie = d3
      .pie<RegionData>()
      .value(d => d.value)
      .sort(null);

    // Create arc generators
    const arc = d3
      .arc<d3.PieArcDatum<RegionData>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const labelArc = d3
      .arc<d3.PieArcDatum<RegionData>>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    // Generate pie data
    const pieData = pie(data);

    // Add slices with animation
    const slices = svg
      .selectAll('.slice')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'slice');

    slices
      .append('path')
      .attr('d', d => arc(d) as string)
      .attr('fill', (d, i) => color(i.toString()) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .style('opacity', 1);

        tooltip
          .style('opacity', 1)
          .html(`<div class="p-2">
                  <div class="font-medium">${d.data.name}</div>
                  <div>Count: ${d.data.value}</div>
                  <div>Percent: ${(d.data.value / d3.sum(data, d => d.value) * 100).toFixed(1)}%</div>
                </div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', event => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .style('opacity', 0.8);
        
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) as string;
        };
      });

    // Add labels for larger slices
    slices
      .filter(d => (d.endAngle - d.startAngle) > 0.25)
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '0.7rem')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .text(d => d.data.name.substring(0, 10) + (d.data.name.length > 10 ? '...' : ''))
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', 1);

    // Add a legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${radius + 10}, ${-radius})`)
      .selectAll('.legend')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d, i) => color(i.toString()) as string);

    legend
      .append('text')
      .attr('x', 15)
      .attr('y', 10)
      .attr('text-anchor', 'start')
      .style('font-size', '0.7rem')
      .text(d => {
        const name = d.data.name;
        return name.length > 15 ? name.substring(0, 15) + '...' : name;
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
