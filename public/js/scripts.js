function renderTreeMap(data) {

  // set up required dimensions
  const width = 1000;
  const height = 700;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

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
    .size([width, height])
    .padding(1)

  // arrange dataset into hierarchical form
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)

  treemap(root);

  // append rect for each leaf node in the dataset
  const tile = svg.selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .style('fill', d => colourScale(d.data.category))
}

const url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

$.getJSON(url, (data) => renderTreeMap(data));
