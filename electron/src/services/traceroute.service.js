const Traceroute = require('nodejs-traceroute');
const dns = require('dns');

module.exports = {
  makeTraceroute: makeTraceroute,
};

function makeTraceroute (destination, onhop, onclose) {
  var traceroute = {
    destination: destination,
    onhop: onhop,
    onclose: onclose
  };

  traceroute.tracer = new Traceroute();
  traceroute.tracer
    .on('pid', (pid) => {
      traceroute.pid = pid;
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
          traceroute.onhop(h);
        });
      }else{
        traceroute.onhop(h);
      }
    })
    .on('close', (code) => {
      console.log(`close: code ${code}`);
      traceroute.pid = null;
      traceroute.onclose();
    });

  traceroute.start = function () {
    try {
      dns.lookup(traceroute.destination, (err, address, family) => {
        var hop = {hop: 'dest', 'host': traceroute.destination, ip: address, rtt: null}
        traceroute.onhop(hop);
      });
      traceroute.tracer.trace(traceroute.destination);
    } catch (ex) {
      traceroute.pid = null;
      console.log(ex);
    }
  }

  traceroute.stop = function () {
    if(traceroute.pid){
      process.kill(traceroute.pid);
    }
  }

  return traceroute;
}
