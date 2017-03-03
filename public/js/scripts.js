function renderTreeMap(data) {

  // set up required dimensions
  const width = 1150;
  const height = 650;
  const margin = { top: 40, right: 150, bottom: 20, left: 10 };
  const legendRectHeight = 20;
  const legendRectWidth = 26;
  const legendX = width - margin.right + 30;
  const legendY = margin.top;
  const legendTextX = legendX + legendRectWidth / 2;
  const legendTextY = legendY + legendRectHeight / 2;

  // set up colour scale
  const platforms = data.children.map(d => d.name);

  const colourScale = d3.scaleOrdinal(d3.schemeCategory20)
    .domain(platforms);

  // append svg to DOM
  const svg = d3.select('.svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // initialise treemap
  const treemap = d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(1);

  // arrange dataset into hierarchical form
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  treemap(root);

  // initialise tooltip
  const tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0);

  // create svg group for each leaf node in the dataset
  const tileGroup = svg.selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g');

  // append rect to each group
  const rect = tileGroup.append('rect')
    .attr('class', 'tile')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => colourScale(d.data.category))
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.value)
    .on('mouseover', function(d) {
      d3.select(this).style('opacity', 0.7)
      const mouse = d3.mouse(this);

      tooltip
        .style('left', `${mouse[0]}px`)
        .style('top', `${mouse[1] - 70}px`)
        .attr('data-value', d.value)
        .html(
          `<span class="tooltip-title">Platform: </span>${d.data.category}<br>
          <span class="tooltip-title">Title: </span>${d.data.name}<br>
          <span class="tooltip-title">Units Sold: </span>${d.value} million`
        )
        .transition()
        .duration(200)
        .style('opacity', .9)
    })
    .on('mouseout', function(d) {
      d3.select(this).style('opacity', 1);

      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    });

  // append text element to group
  const text = tileGroup.append('text')
    .attr('y', d => d.y0 + 1)
    .attr('xAttr', d => d.x0);

  // split name into array and represent each with a tspan element
  const label = text.selectAll('text')
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('x', function(d) { return d3.select(this.parentNode).attr('xAttr'); })
    .attr('dy', 9)
    .attr('dx', 3)
    .text(d => d);

  function legendRectX(d, i) {
    return i % 2 === 0 ? legendX : legendX + (2.5 * legendRectWidth)
  }

  function legendRectY(d, i) {
    if (i % 2 === 0) {
      return legendY + i * legendRectHeight;
    }
    else {
      return legendY + (i - 1) * legendRectHeight;
    }
  }

  // set up legend
  const legend = svg.append('g')
    .attr('id', 'legend')

  const legendRect = legend.selectAll('rect')
    .data(platforms)
    .enter()
    .append('rect')
    .attr('x', (d, i) => legendRectX(d, i))
    .attr('y', (d, i) => legendRectY(d, i))
    .attr('width', legendRectWidth)
    .attr('height', legendRectHeight)
    .style('fill', (d) => colourScale(d))
    .attr('stroke', 'black')
    .attr('stroke-width', 0.3)
    .attr('data-category', d => d)
    .on('mouseover', function(d) {
      const category = d3.select(this).attr('data-category');

      d3.selectAll(`rect[data-category="${category}"]`).style('opacity', 0.7);
    })
    .on('mouseout', (d) => {
      // const category = d3.select(this).attr('data-category');

      // d3.selectAll(`rect[data-category="${category}"]`).style('opacity', 1);
      d3.selectAll('rect').style('opacity', 1)
    });

  const legendText = legend.selectAll('text')
    .data(platforms)
    .enter()
    .append('text')
    .attr('class', 'legend-text')
    .attr('x', (d, i) => legendRectX(d, i) + legendRectWidth / 2)
    .attr('y', (d, i) => legendRectY(d, i) + legendRectHeight * 1.6)
    .text(d => d)
    .style('text-anchor', 'middle')
}



const url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

$.getJSON(url, (data) => renderTreeMap(data));
