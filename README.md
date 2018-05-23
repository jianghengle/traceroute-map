# traceroute-map
A traceroute on map application.

Project diagram:  
![alt text](https://github.com/jianghengle/traceroute-map/raw/master/new-traceroute-map.png)

Application release:
* [Online Live Demo](http://traceroute-map.s3-website.us-east-2.amazonaws.com/)
* [Mac OS installer](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.3/Traceroute.Map-0.0.3.dmg)
* Screen Shot:
  ![Screen Shot](https://github.com/jianghengle/traceroute-map/raw/master/app-screen-shot.png)
  * Show multiple traceroutes on the map
  * Click the "cog" button on the header to add/change traceroute sources
  * Click the "columns" button on the header to change the view mode

Traceroute agent release, usage: `./agent [port]`, the default port is 8000:
* [Linux 32bit](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent)
* [Linux 64bit](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent-linux)
* [Mac OS](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent-macos)
* [Windows](https://github.com/jianghengle/traceroute-map/releases/download/v0.0.2/agent-win.exe)

Some maybe live traceroute sources or agents:
* 129.93.175.20:8000 (An anvil vm in University of Nebraska-Lincoln)
* 54.201.228.93:8000 (Oregon)

Three directories:
* agent: traceroute + websocket server
* client: the client code in Vue.js
* electron: the desktop app container in Electron


