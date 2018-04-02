from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from urlparse import urlparse
from traceroute import Traceroute
import threading
import sys


class Agent(WebSocket):
    traceroutes = []

    def handleConnected(self):
        print(self.address, 'connected')
        t = threading.Thread(target=self.start)
        t.start()

    def start(self):
        try:
            self.parseTarget()
            traceroute = Traceroute(self.target, self)
            Agent.traceroutes.append(traceroute)
            self.dispatch()
        except:
            self.close()

    def parseTarget(self):
        query = urlparse(self.request.path).query
        query_components = dict(qc.split("=") for qc in query.split("&"))
        self.target = query_components["target"]
        print(self.target)

    def dispatch(self):
        while len(Agent.traceroutes) > 0:
            t = Agent.traceroutes[0]
            if t.status == 'ready':
                t.run()
                break
            elif t.status == 'running':
                break
            elif t.status == 'done':
                t.agent.close()
                Agent.traceroutes.remove(t)


    def handleClose(self):
        for t in Agent.traceroutes:
            if t.agent == self:
                t.status = 'done'
        print(self.address, 'closed')


if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    server = SimpleWebSocketServer('', port, Agent)
    server.serveforever()
