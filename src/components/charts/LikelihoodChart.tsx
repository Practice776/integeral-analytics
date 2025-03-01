
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LikelihoodData {
  likelihood: number;
  count: number;
}

interface LikelihoodChartProps {
  data: LikelihoodData[];
  height?: number;
}

const LikelihoodChart: React.FC<LikelihoodChartProps> = ({ data, height = 300 }) => {
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
      .domain(data.map(d => d.likelihood.toString()))
      .range([0, width])
      .padding(0.4);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count) as number])
      .nice()
      .range([chartHeight, 0]);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // Add X axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', chartHeight + margin.bottom - 10)
      .text('Likelihood')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

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

    // Add chart title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '1rem')
      .attr('font-weight', '600')
      .attr('fill', 'currentColor')
      .text('Likelihood Distribution');

    // Create color scale
    const colorScale = d3
      .scaleLinear<string>()
      .domain([1, 4])
      .range(['#38d9a9', '#12b886'])
      .interpolate(d3.interpolateHcl);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    // Add a dashed line for the average likelihood
    const avgLikelihood = d3.mean(data, d => d.likelihood) || 0;
    
    svg.append('line')
      .attr('x1', 0)
      .attr('y1', y(avgLikelihood * 0.7))
      .attr('x2', width)
      .attr('y2', y(avgLikelihood * 0.7))
      .attr('stroke', '#666')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0)
      .transition()
      .delay(800)
      .duration(500)
      .attr('opacity', 0.5);

    // Add dots for the data points
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => (x(d.likelihood.toString()) as number) + x.bandwidth() / 2)
      .attr('cy', d => y(d.count))
      .attr('r', 5)
      .attr('fill', d => colorScale(d.likelihood))
      .attr('opacity', 0)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 8);
          
        tooltip
          .style('opacity', 1)
          .html(`<div class="p-2">
                  <div class="font-medium">Likelihood: ${d.likelihood}</div>
                  <div>Count: ${d.count}</div>
                </div>`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', event => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', 5);
          
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('opacity', 1);

    // Add line between the dots
    const line = d3
      .line<LikelihoodData>()
      .x(d => (x(d.likelihood.toString()) as number) + x.bandwidth() / 2)
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    const sortedData = [...data].sort((a, b) => a.likelihood - b.likelihood);
    
    svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#12b886')
      .attr('stroke-width', 2)
      .attr('d', line)
      .attr('stroke-dasharray', function() {
        const pathLength = (this as SVGPathElement).getTotalLength();
        return pathLength + ' ' + pathLength;
      })
      .attr('stroke-dashoffset', function() {
        return (this as SVGPathElement).getTotalLength();
      })
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);

    // Add area beneath the line
    const area = d3
      .area<LikelihoodData>()
      .x(d => (x(d.likelihood.toString()) as number) + x.bandwidth() / 2)
      .y0(chartHeight)
      .y1(d => y(d.count))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'url(#gradient)')
      .attr('opacity', 0)
      .attr('d', area)
      .transition()
      .delay(800)
      .duration(800)
      .attr('opacity', 0.2);

    // Create gradient for area
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#12b886')
      .attr('stop-opacity', 0.8);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#12b886')
      .attr('stop-opacity', 0);

    // Clean up function
    return () => {
      tooltip.remove();
    };
  }, [data, height]);

  return (
    <div className="w-full h-full overflow-hidden">
      <svg ref={svgRef} className="w-full h-full d3-chart"></svg>
    </div>
  );
};

export default LikelihoodChart;
