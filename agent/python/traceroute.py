#!/usr/bin/python

import socket
import struct
import sys
import json
from datetime import datetime

class Traceroute:
    def __init__(self, dest_name, agent=None):
        self.agent = agent
        self.dest_name = dest_name
        self.dest_addr = socket.gethostbyname(dest_name)
        self.status = 'ready'
        self.output_hop('dest', dest_name, self.dest_addr, 0)

    def run(self):
        self.status = 'running'
        port = 33434
        max_hops = 30
        icmp = socket.getprotobyname('icmp')
        udp = socket.getprotobyname('udp')
        recv_socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, icmp)
        recv_socket.bind(("", port))
        send_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, udp)
        hop = 1
        while True and self.status == 'running':
            # Build the GNU timeval struct (seconds, microseconds)
            # Set the receive timeout so we behave more like regular traceroute
            timeout = struct.pack("ll", 5, 0)
            recv_socket.setsockopt(socket.SOL_SOCKET, socket.SO_RCVTIMEO, timeout)
            send_socket.setsockopt(socket.SOL_IP, socket.IP_TTL, hop)
            rtt = None
            curr_addr = None
            finished = False
            tries = 3
            while not finished and tries > 0 and self.status == 'running':
                try:
                    start = datetime.now()
                    send_socket.sendto("", (self.dest_addr, port))
                    _, curr_addr = recv_socket.recvfrom(512)
                    rtt = (datetime.now() - start).microseconds / 1000.0
                    finished = True
                    curr_addr = curr_addr[0]
                except KeyboardInterrupt:
                    raise
                except:
                    tries = tries - 1
            try:
                curr_name = socket.gethostbyaddr(curr_addr)[0]
            except:
                curr_name = curr_addr

            self.output_hop(hop, curr_name, curr_addr, rtt)

            hop = hop + 1
            if curr_addr == self.dest_addr or hop > max_hops:
                break
            rtt = 0
            curr_addr = None
            finished = False
        send_socket.close()
        recv_socket.close()
        self.status = 'done'
        if self.agent != None:
            self.agent.dispatch()

    def output_hop(self, hop, host, ip, rtt):
        obj = {'hop': hop, 'host': host, 'ip': ip, 'rtt': rtt}
        json_str = json.dumps(obj)
        print(json_str)
        if self.agent != None and self.status != 'done':
            self.agent.sendMessage(json_str.decode('utf-8'))

if __name__ == "__main__":
    traceroute = Traceroute(sys.argv[1])
    traceroute.run()
