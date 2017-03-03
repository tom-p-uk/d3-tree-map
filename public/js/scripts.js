function renderTreeMap(dataRaw) {

  // set up required dimensions
  const width = 1000;
  const height = 700;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };

}

const url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

$.getJSON(eduUrl, (data) => renderTreeMap(data));
