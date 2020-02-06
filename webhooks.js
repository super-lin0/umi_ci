const http = require('http');
const createHandler = require('github-webhook-handler');
const { spawn } = require('child_process');

const handler = createHandler({
  path: '/docker_deploy',
  secret: '46f3659f0276a81439be3701ec203b5f9b15724b',
});

const run_cmd = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let resp = '';

  child.stdout.on('data', buffer => {
    resp += buffer.toString();
  });

  child.stdout.on('end', () => {
    callback(resp);
  });
};

http
  .createServer((req, res) => {
    handler(req, res, err => {
      res.statusCode = 404;
      res.end('no such location');
    });
  })
  .listen(7777, () => {
    console.log('webhook listen 7777');
  });

handler.on('error', err => {
  console.error('Error', err.message);
});

handler.on('*', event => {
  console.log('receive * ', event.payload);
});
