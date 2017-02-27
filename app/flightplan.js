var plan = require('flightplan');

plan.target('staging', {
  host: '188.166.226.121',
  username: 'deploy',
  privateKey: '../conf.d/ssh/deploy',
  agent: process.env.SSH_AUTH_SOCK
}, {
  webRoot: '/var/www/rangoon-mapper-staging'
});

plan.target('production', {
  webRoot: '/var/www/rangoon-mapper',
  host: '188.166.226.121',
  username: 'deploy',
  privateKey: '../conf.d/ssh/deploy',
  agent: process.env.SSH_AUTH_SOCK
}, {
  webRoot: '/var/www/rangoon-mapper'
});

plan.remote(function (remote) {
  var webRoot = plan.runtime.options.webRoot;
  remote.with('cd ' + webRoot, function () {
    remote.exec('git pull');
    remote.with('cd app', function () {
      remote.exec('npm install');
      remote.exec('npm run build');
    });
  });
});
