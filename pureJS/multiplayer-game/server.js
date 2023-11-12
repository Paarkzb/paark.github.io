// Dependencies
let express = require("express");
let http = require("http");
let path = require("path");
let socketIO = require("socket.io");

let app = express();
let server = http.Server(app);
let io = socketIO(server);

app.set("port", 5000);
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/public", express.static(__dirname + "/public"));
app.use("/shared", express.static(__dirname + "/shared"));

// Routing
app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname + "/views", "index.html"));
});

// Starts the server
server.listen(5000, function () {
    console.log("Starting server on port 5000");
});

let players = {};
io.on("connection", function (socket) {
    socket.on("new player", function () {
        console.log("user connected");

        players[socket.id] = {
            x: 300,
            y: 300,
        };
    });

    socket.on("movement", function (data) {
        let player = players[socket.id] || {};

        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });

    socket.on("disconnect", function () {
        console.log("user disconnected");
        delete players[socket.id];
    });
});

setInterval(function () {
    io.sockets.emit("state", players);
}, 1000 / 60);
