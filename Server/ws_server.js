
var WebSocketServer = require('websocket').server;
var http = require('http');
var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs")
port = process.argv[2] || 8080;
var server = http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

//Object constructor for user/room storage.
function userConnection(username, connection, room){
    this.username = username;
    this.connection = connection;
    this.room = room;
}

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");
var count = 0;
var clients = {};
var connections = {};
var lastPaint = 0;
var rooms = {};
var roomcount = 0;

// server.listen(8080, function() {
//     console.log((new Date()) + ' Server is listening on port 8080');
// });

wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.binaryType = "arraybuffer";

wsServer.on('request', function(r){
    // Code here to run on connection
    var connection = r.accept('echo-protocol', r.origin); // get the username and chatroom here
    // Specific id for this client & increment count
    var id = count++;
    // Store the connection method so we can loop through & contact all clients
    console.log("Connection made at: " + connection.remoteAddress);
    connections[id] = connection;

    if(lastPaint != 0){ // send the canvas to new joiners of the chat room
        connections[id].sendUTF(lastPaint);
    }

    console.log((new Date()) + ' Connection accepted [' + id + ']');

    //used for user connection object.
    var UC;

    // Create event listener
    connection.on('message', function(message) {
            var username;
            var room;
            

        if (message.type === 'utf8') { // after this but b4 echo test to see if msg or command code

            //replaced substring with split();            
            var str = message.utf8Data.split(":");

            // cmd/msg/paint = str[0], user = str[1], **room = str[2]**on cmd case only**

            switch(str[0]){
                case "cmd": // command code
                    username = str[1];
                    room = str[2];

                    //check if another user has the same name inthe room they're trying to join.
                    for(var i in clients){
                        if(clients[i].username == username && clients[i].room == room){
                            console.log("This name is already being used");
                            
                            connection.sendUTF("cmd:username");
                        }
                    }
                    if(clients[id] == null){ //envoked on user's first connection.
                        UC = new userConnection(username, connections[id], room);
                        clients[id] = UC;                  
                    }
                    console.log('Command Code -- User: ' + UC.username + ' Room: ' + UC.room);
                break;

                case "msg": // regular chat msg
                    console.log('Message Code -- Received: ' + message.utf8Data); // log the message to the server console

                    // The string message that was sent to us
                    var msgString = message.utf8Data;

                    for(var i in clients){ //for every client, send to users with the same room attribute.
                        
                        if(clients[i].room == UC.room){
                            console.log(clients[i].username + ' is sending to room ' + clients[i].room);
                            clients[i].connection.sendUTF(msgString);
                        }
                    }


                    break;

                case "data": // what to do when paint is recieved
                console.log('Received Paint');

                    // The string message that was sent to us
                    var msgString = message.utf8Data;
                    lastPaint = msgString;

                    // Loop through all clients
                     for(var i in clients){
                        
                        if(clients[i].room == UC.room){
                            console.log(clients[i].username + ' is sending to room ' + clients[i].room);
                            clients[i].connection.sendUTF(msgString);
                        }
                    }
                    break;
                    console.log('Error');
                    default:
                    

                }


            } else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            }



        });

connection.on('close', function(reasonCode, description) {
    delete connections[id];
    delete clients[id];

    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
});
});
