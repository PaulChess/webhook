let http = require('http');
let crypto = require('crypto');
let { spawn } = require('child_process');

const SECRET = '123456';

function sign(body) {
  return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`;
}

const server = http.createServer(function(req, res) {
  console.log(req.method, req.url);
  if (req.method == 'POST' && req.url == '/webhook') {
    let buffers = [];
    req.on('data', function(buffer) {
      buffers.push(buffer);
    });
    req.on('end', function() {
      let body = Buffer.concat(buffers);
      let event = req.headers['x-github-event']; // event = push
      // github请求来的时候，要传递请求体body, 另外还会传一个signature过来，需要验证签名对不对
      let sig = req.headers['x-hub-signature'];
      if (sig !== sign[body]) {
        return res.end('Not Allowed');
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
      // 开始部署
      if (event === 'push') {
        let payload = JSON.parse(body);
        console.log(payload);
        let child = spawn('sh', [`./${payload.repository.name}.sh`]);
        let buffers = [];
        child.stdout.on('data', function(buffer) {
          buffers.push(buffer);
        })
        child.stdout.on('end', function() {
          let log = Buffer.concat(buffers);
          console.log(log);
        })
      }
    })
  } else {
    res.end('NOT FOUND');
  }
});

server.listen(4000, () => {
  console.log('webhook服务已在4000端口上启动');
});
