import socketio
import requests

url = "http://localhost:5345/testData/addData"

body = {"payload": "TITEEEE*14.128597*121.20649",
        "topic":"message"
}

requests.post(url, body)


# create a Socket.io client instance
sio = socketio.Client()

# define the event handler for the 'connect' event
@sio.event
def connect():
    print('connected to server')

# define the event handler for the 'disconnect' event
@sio.event
def disconnect():
    print('disconnected from server')

# connect to the Socket.io server
sio.connect('http://localhost:5345')

# emit a 'chat message' event to the server
sio.emit('addData', body)

# disconnect from the server
sio.disconnect()
