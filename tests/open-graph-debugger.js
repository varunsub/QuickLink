const og = require('open-graph');
const url = 'http://localhost:5000/a/bE9Ne6bVBhmhhs9gopgeQK';

/**
 * Test to ensure opengraph tags are valid for each page
 * Update the URL to test different pages
 */

og(url, function(err, meta) {
  console.log(meta);
  console.log(err);
});
