let http = require('http');

const server = http.createServer(function(req, res) {
  console.log(req.method, req.url);
  if (req.method == 'POST' && req.method == '/webhook') {
    let buffers = [];
    req.on('data', function(buffer) {
      buffers.push(buffer);
    });
    req.on('end', function() {
      let body = Buffer.concat(buffers);
      let event = req.headers['x-gitHub-event']; // event = push
      // github请求来的时候，要传递请求体body, 另外还会传一个signature过来，需要验证签名对不对
      let sig = req.headers['x-hub-signature'];
    })
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.end('NOT FOUND');
  }
});

server.listen(4000, () => {
  console.log('webhook服务已在4000端口上启动');
});
