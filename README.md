# traceroute-map
A traceroute on map application.

Project diagram:  
![alt text](https://github.com/jianghengle/traceroute-map/raw/master/new-traceroute-map.png)

Application release:
* [Online Live Demo](http://traceroute-map.s3-website.us-east-2.amazonaws.com/)
* [Mac OS installer](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/Traceroute.Map-0.0.2.dmg)
* [Windows installer](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/Traceroute.Map.Setup.0.0.2.exe)

Traceroute agent release, usage: ./agent [port], the default port is 8000:
* [Linux 32bit](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent)
* [Linux 64bit](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent-linux)
* [Mac OS](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent-macos)
* [Windows](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent-win.exe)

Some maybe live traceroute sources or agents:
* 129.93.175.20:8000 (An anvil vm in University of Nebraska-Lincoln)
* planetlab-04.cs.princeton.edu:8000 (Princeton University)
* 54.201.228.93:8000 (Oregon)
* planetlab5.ie.cuhk.edu.hk:8000 (Hongkong, China)
* planetlab1.aut.ac.nz:8000 (New Zealand)

Three directories:
* agent: traceroute + websocket server
* client: the client code in Vue.js
* electron: the desktop app container in Electron


