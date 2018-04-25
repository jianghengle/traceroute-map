# traceroute-map
A traceroute on Google map app: [Live Demo](http://traceroute-map.s3-website.us-east-2.amazonaws.com/)

Some live agents or sources:
* 129.93.175.20:8000 (An anvil vm in UNL)
* planetlab-04.cs.princeton.edu:8000 (Princeton University)
* 54.201.228.93:8000 (Oregon)
* planetlab5.ie.cuhk.edu.hk:8000 (Hongkong, China)

Project diagram:
![alt text](https://github.com/jianghengle/traceroute-map/raw/master/traceroute-map.png)

Three directories:
* agent: traceroute + websocket server
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
