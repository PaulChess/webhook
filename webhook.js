let http = require('http');

const server = http.createServer(function(req, res) {
  console.log(req.method, req.url);
  if (req.method == 'POST' && req.method == '/webhook') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.end('NOT FOUND');
  }
});

server.listen(4000, () => {
  console.log('webhook服务已在4000端口上启动');
});
