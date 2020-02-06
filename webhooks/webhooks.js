var http = require('http');
var createHandler = require('github-webhook-handler');
var handler = createHandler({
  path: '/docker_deploy',
  secret: '46f3659f0276a81439be3701ec203b5f9b15724b',
});

function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = '';

  child.stdout.on('data', function(buffer) {
    resp += buffer.toString();
  });
  child.stdout.on('end', function() {
    callback(resp);
  });
}

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end('no such location');
    });
  })
  .listen(7777, () => {
    console.log('WebHooks Listern at 7777');
  });

handler.on('error', function(err) {
  console.error('Error:', err.message);
});

handler.on('*', function(event) {
  console.log('Received *', event);
});

handler.on('push', function(event) {
  const { repository, ref } = event.payload;
  console.log('Received a push event for %s to %s', repository.name, ref);
  // 分支判断
  if (event.payload.ref === 'refs/heads/master') {
    console.log('deploy master..');
    run_cmd('sh', ['../deploy-dev.sh'], function(text) {
      console.log(text);
    });
  }
});

handler.on('issues', function(event) {
  const {
    repository: { name },
    action,
    issue: { number, title },
  } = event.payload;
  console.log('Received an issue event for % action=%s: #%d %s', name, action, number, title);
});
