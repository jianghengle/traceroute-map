# agent

traceroute + websocket server in NodeJS

Setup:
1. `npm install`
2. `node agent.js [port]`

Traceroute is using [nodejs-traceroute](https://github.com/zulhilmizainuddin/nodejs-traceroute).

Websocket server is [ws](https://github.com/websockets/ws). Parse the url `ws://host:port/?target=host` to get the traceroute target, and send back each hop in JSON: `{"hop": 1, "host": "router", "ip": "1.1.1.1", "rtt": 20.1}` 
