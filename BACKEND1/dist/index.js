"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
console.log("WebSocket server running on port 8080");
wss.on("connection", function connection(ws) {
    console.log("A new player has connected.");
    gameManager.addUser(ws);
    ws.on("error", (error) => console.error("WebSocket error:", error));
    ws.on("close", () => {
        console.log("A player has disconnected.");
        gameManager.removeUser(ws);
    });
});
