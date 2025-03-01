
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface YearTrendData {
  year: number;
  avgIntensity: number;
  avgLikelihood: number;
  avgRelevance: number;
}

interface YearTrendsChartProps {
  data: YearTrendData[];
  height?: number;
}

const YearTrendsChart: React.FC<YearTrendsChartProps> = ({ data, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set dimensions and margins
    const margin = { top: 30, right: 100, bottom: 50, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create svg
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', chartHeight + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort data by year
    const sortedData = [...data].sort((a, b) => a.year - b.year);

    // X scale
    const x = d3
      .scaleLinear()
      .domain(d3.extent(sortedData, d => d.year) as [number, number])
      .range([0, width]);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, d => 
        Math.max(d.avgIntensity, d.avgLikelihood, d.avgRelevance)
      ) as number * 1.1])
      .nice()
      .range([chartHeight, 0]);

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => d.toString()));

    // Add Y axis
    svg.append('g').call(d3.axisLeft(y));

    // Add X axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', chartHeight + margin.bottom - 10)
      .text('Year')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

    // Add Y axis label
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -chartHeight / 2)
      .text('Average Value')
      .attr('fill', 'currentColor')
      .attr('font-size', '0.75rem');

    // Define line generators
    const intensityLine = d3
      .line<YearTrendData>()
      .x(d => x(d.year))
      .y(d => y(d.avgIntensity))
      .curve(d3.curveMonotoneX);

    const likelihoodLine = d3
      .line<YearTrendData>()
      .x(d => x(d.year))
      .y(d => y(d.avgLikelihood))
      .curve(d3.curveMonotoneX);

    const relevanceLine = d3
      .line<YearTrendData>()
      .x(d => x(d.year))
      .y(d => y(d.avgRelevance))
      .curve(d3.curveMonotoneX);

    // Create tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('opacity', 0);

    // Add the intensity line
    const intensityPath = svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#228be6')
      .attr('stroke-width', 2)
      .attr('d', intensityLine);

    // Add the likelihood line
    const likelihoodPath = svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#12b886')
      .attr('stroke-width', 2)
      .attr('d', likelihoodLine);

    // Add the relevance line
    const relevancePath = svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#7950f2')
      .attr('stroke-width', 2)
      .attr('d', relevanceLine);

    // Animate the lines
    const animateLine = (path: d3.Selection<SVGPathElement, unknown, null, undefined>) => {
      const length = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', length + ' ' + length)
        .attr('stroke-dashoffset', length)
        .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 0);
    };

    animateLine(intensityPath);
    animateLine(likelihoodPath);
    animateLine(relevancePath);

    // Add circles for data points with hover effects
    const addDataPoints = (
      data: YearTrendData[],
      key: keyof YearTrendData,
      color: string
    ) => {
      svg
        .selectAll(`.point-${key}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `point-${key}`)
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d[key] as number))
        .attr('r', 4)
        .attr('fill', color)
        .style('opacity', 0)
        .on('mouseover', (event, d) => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 6);
          
          tooltip
            .style('opacity', 1)
            .html(`<div class="p-2">
                    <div class="font-medium">Year: ${d.year}</div>
                    <div>Intensity: ${d.avgIntensity.toFixed(1)}</div>
                    <div>Likelihood: ${d.avgLikelihood.toFixed(1)}</div>
                    <div>Relevance: ${d.avgRelevance.toFixed(1)}</div>
                  </div>`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', event => {
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 4);
          
          tooltip.style('opacity', 0);
        })
        .transition()
        .delay((d, i) => 1500 + i * 50)
        .duration(300)
        .style('opacity', 1);
    };

    addDataPoints(sortedData, 'avgIntensity', '#228be6');
    addDataPoints(sortedData, 'avgLikelihood', '#12b886');
    addDataPoints(sortedData, 'avgRelevance', '#7950f2');

    // Add a legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    const legendItems = [
      { name: 'Intensity', color: '#228be6' },
      { name: 'Likelihood', color: '#12b886' },
      { name: 'Relevance', color: '#7950f2' },
    ];

    legendItems.forEach((item, i) => {
      const legendItem = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', item.color);

      legendItem
        .append('text')
        .attr('x', 15)
        .attr('y', 9)
        .attr('font-size', '0.75rem')
        .attr('fill', 'currentColor')
        .text(item.name);
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

export default YearTrendsChart;
