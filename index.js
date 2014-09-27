var app = require('express')();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var request = require('request');
var CronJob = require('cron').CronJob;


function request_json() {
  request
    .get('https://bm3.itsoninc.com/jenkins/view/qe_web_sdc/job/Web_SDC_IT_RegressionTestSuite_DEV/lastBuild/api/json', function(error, response, body) {
      var response = JSON.parse(body);
      console.info('BUILD#' + response.number);
      console.info('RESULT#' + response.result);
      console.info('.............................');
    })
    .auth('saasro', 'saasro', true);
}

function cronjob() {
  var job = new CronJob({
    cronTime: '10 * * * * *',
    onTick: function() {

      request_json();

      // var _date = (new Date()).toString();
      // console.info(_date);
      // io.emit('chat message', _date);
    },
    start: true
  });
  job.start();
}

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

server.listen(3000, function() {
  console.log('listening on *:3000');
});
