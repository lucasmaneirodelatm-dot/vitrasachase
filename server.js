const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: { origin: "*" }
});

// RUTA PUBLIC
app.use(express.static(path.join(__dirname, "public")));

// SALAS
io.on("connection", socket => {
    console.log("Cliente conectado:", socket.id);

    socket.on("crearSala", ({ nombre, nivel }) => {
        const codigo = socket.id.slice(0, 6);
        socket.join(codigo);
        socket.emit("salaCreada", codigo);
    });

    socket.on("unirse", codigo => {
        socket.join(codigo);
        socket.emit("unido", codigo);
        socket.to(codigo).emit("jugadorEntra");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor online en puerto", PORT));
