const og = require('open-graph');
const url = 'http://localhost:5000/a/bE9Ne6bVBhmhhs9gopgeQK';

og(url, function(err, meta) {
  console.log(meta);
  console.log(err);
});
