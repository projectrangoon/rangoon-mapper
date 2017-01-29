var plan = require('flightplan');

plan.target('production', {
  host: '188.166.226.121',
  username: 'deploy',
  privateKey: '../conf.d/ssh/deploy',
  agent: process.env.SSH_AUTH_SOCK
});

plan.remote(function (remote) {
  remote.with('cd /var/www/rangoon-mapper', function () {
    remote.exec('git pull');
    remote.with('cd app', function () {
      remote.exec('npm install');
      remote.exec('npm run build');
    });
  });
});
