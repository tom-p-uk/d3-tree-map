function renderTreeMap(data) {

  // set up required dimensions
  const width = 1100;
  const height = 650;
  const margin = { top: 20, right: 80, bottom: 20, left: 20 };

  // const dataEdited = {
  //   name: data.name,
  //   children: data.children.map((obj) => {
  //     return {
  //       name: obj.name,
  //       children: obj.children,
  //       value: obj.children.map(el => parseFloat(el.value))
  //         .reduce((a, b) => a + b)
  //         .toString()
  //     };
  //   })
  // };

  // set up colour scale
  const platforms = data.children.map(d => d.name);

  const colourScale = d3.scaleOrdinal(d3.schemeCategory20)
    .domain(platforms)

  // append svg to DOM
  const svg = d3.select('.svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // initialise treemap
  const treemap = d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(1)

  // arrange dataset into hierarchical form
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)

  treemap(root);

  // initialise tooltip
  const tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)

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
      const mouse = d3.mouse(this);

      // show tooltip when user hovers over bar and dynamically allocate attributes
      tooltip
        .style('left', `${mouse[0]}px`)
        .style('top', `${mouse[1] - 70}px`)
        .attr('data-value', d.value)
        .html(
          `<span class="tooltip-title">Platform: </span>${d.data.category}<br>
          <span class="tooltip-title">Title: </span>${d.data.name}<br>
          <span class="tooltip-title">Total Sales: </span>${d.value} million Units`
        )
        .transition()
        .duration(200)
        .style('opacity', .9)
    })
    .on('mouseout', (d) => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })

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
    .text(d => d)
}

const url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

$.getJSON(url, (data) => renderTreeMap(data));
