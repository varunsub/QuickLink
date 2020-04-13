const http = require('http');

const server = http.createServer((req, res) => {
  for (let i=0; i<1000; i++) {
    server.on('request', function leakyfunc() {});
  }
  res.end('Hello World\n');
}).listen(5000, '127.0.0.1');
server.setMaxListeners(0);

console.log('Server running at http://127.0.0.1:1337/. Process PID: ', process.pid);
