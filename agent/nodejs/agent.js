const WebSocket = require('ws');
const Traceroute = require('nodejs-traceroute');
const dns = require('dns');
var url = require('url');

var port = 8000;
if(process.argv.length){
  var arg = process.argv[process.argv.length - 1];
  var p = parseInt(arg);
  if(!isNaN(p)){
    port = p;
  }
}

const wss = new WebSocket.Server({ port: port });
console.log('websocket server is listening on port: %d', port);

wss.on('connection', function connection(ws, req) {
  var pid = null;
  
  var queryData = url.parse(req.url, true).query;
  var target = queryData.target;
  if (!target) {
    ws.close();
    return;
  }

  var tracer = new Traceroute();
  tracer
    .on('pid', (p) => {
      pid = p;
      console.log(`pid: ${pid}`);
    })
    .on('destination', (destination) => {
      console.log(`destination: ${destination}`);
    })
    .on('hop', (hop) => {
      console.log(`hop: ${JSON.stringify(hop)}`);
      var h = {hop: hop.hop, host: null, ip: null, rtt: null};
      if(hop.rtt1 && hop.rtt1 != '*'){
        h.rtt = parseFloat(hop.rtt1);
      }
      if(hop.ip && hop.ip != '*'){
        h.ip = hop.ip;
        dns.reverse(h.ip, (err, hostnames) => {
          if (err) {
            h.host = h.ip;
          }else{
            h.host = hostnames[0];
          }
          sendHop(ws, h);
        });
      }else{
        sendHop(ws, h);
      }
    })
    .on('close', (code) => {
      console.log(`close: code ${code}`);
      pid = null;
      ws.close();
    });

  try{
    dns.lookup(target, (err, address, family) => {
      if (err) {
        throw 'failed to get destination address'
      }
      var h = {hop: 'dest', 'host': target, ip: address, rtt: null};
      sendHop(ws, h);
      tracer.trace(target);
    });
  } catch (ex) {
    console.log(ex);
    if(pid){
      process.kill(pid);
    }
    ws.close();
  }

  ws.on('close', function() {
    console.log('closed by client');
    if(pid){
      process.kill(pid);
    }
  });
});


function sendHop (ws, hop) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(hop));
  }
}
