import logging

from zmq import error as zmq_error
import zmq.green as zmq
import json


def context():
    return zmq.Context()


ctx = context()


class Publisher(object):
    def __init__(self, url=None, context=ctx):
        self.url = url or "inproc://spam"
        self.socket = context.socket(zmq.PUB)
        self.socket.bind(self.url)

    def send(self, p_id, msg):
        topic = str(p_id).encode('utf8')
        print('bus_send', b"%s %s" % (topic, json.dumps(msg).encode('utf8')))
        self.socket.send(b"%s %s" % (topic, json.dumps(msg).encode('utf8')))


class Subscriber(object):
    def __init__(self, topic, url=None, context=ctx):
        topic = str(topic).encode('utf8')
        self.url = url or "inproc://spam"
        self.socket = context.socket(zmq.SUB)
        self.socket.connect(self.url)
        self.socket.setsockopt(zmq.SUBSCRIBE, topic)

    def recv(self):
        msg = None
        try:
            # import ipdb; ipdb.set_trace()
            msg = self.socket.recv(flags=zmq.NOBLOCK)
        except zmq_error.Again:
            return
        try:
            print("zmq.recv", msg)
            key, data = msg.split(b' ', 1)
            return json.loads(data)
        except Exception as excp:
            logging.exception("fail")
