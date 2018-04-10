# agent

traceroute + websocket server

Two implementations: NodeJS and Python

Parse the url `ws://host:port/?target=host` to get the traceroute target, and send back each hop in JSON: `{"hop": 1, "host": "router", "ip": "1.1.1.1", "rtt": 20.1}` 

You could test the agent by [this app](https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo?hl=en). Input the url as `ws://host:port/?target=host`, and then connect, and then you should see the traceroute results in the log.

Test agent at: 129.93.175.20, `ssh -i key centos@129.93.175.20`

Using [screen](http://aperiodic.net/screen/quick_reference) or `nohup` to run the agent.

Currently there are two agents (NodeJS implementation) running on the public servers: `129.93.175.20:8000` and `planetlab5.ie.cuhk.edu.hk:8000`.
