# traceroute-map

Project diagram:
![alt text](https://github.com/jianghengle/traceroute-map/raw/master/traceroute-map.png)

Three directories:
* agent: traceroute + websocket server in Python
* client: the client code in Vue.js
* electron: the desktop app container in Electron

Some Git commands:
* Clone repo: `git clone git@github.com:jianghengle/traceroute-map.git`
* Pull branches from server: `git pull`
* Create and switch to a new branch: `git checkout -b hengle/python_agent` 
* Switch branch: `git checkout hengle/python_agent`
* Check current branch status: `git status`
* Add changes to stage: `git add .`
* Commit stage to current branch: `git commit -m"commit message"`
* Push branches to server: `git push`
* Delele branch: `git branch -d hengle/python_agent`
* Check diff from stage: `git diff`

Note: do NOT commit to `master` branch directly. Instead commit in your branch, push to server and create pull request.

Test agent at: 129.93.175.20
