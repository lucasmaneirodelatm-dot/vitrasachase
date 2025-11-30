const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

// Archivos HTML y JS
app.use(express.static("public"));

const engine = require("./world_engine")(io);

io.on("connection", socket => {
    console.log("🟢 Usuario conectado");

    socket.emit("worldUpdate", engine.buses);

    socket.on("timbre", data => {
        console.log("🔔 Timbre en bus:", data.busId);
        engine.buses[data.busId].timbre = true;
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado");
    });
});

http.listen(3000, () =>
    console.log("Servidor en http://localhost:3000")
);
