# agent

traceroute + websocket server in Python

Setup:
1. Create python2 virtual environment: `virtualenv venv`
2. Active virtual environment: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. To deactivate virtual environment: `deactivate`

Traceroute is based on a [git gist](https://gist.github.com/jcjones/0f3f11a785a833e0a216). Need to solve some problems in this code:
* Need to measure round trip time
* Do not run it in `sudo`
* Adapt to websocket server

Websocket server uses [this package](https://github.com/dpallot/simple-websocket-server). Parse the url `ws://host:port/?target=host` to get the traceroute target, and send back each hop in JSON: `{"hop": 1, "host": "router", "ip": "1.1.1.1", "rtt": 20.1}` 

You could test the agent by [this app](https://chrome.google.com/webstore/detail/simple-websocket-client/pfdhoblngboilpfeibdedpjgfnlcodoo?hl=en). Input the url as `ws://host:port/?target=host`, and then connect, and then you should see the traceroute result in the log.
