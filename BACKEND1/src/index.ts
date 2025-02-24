import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 WebSocket server started on ws://localhost:${PORT}`);

new GameManager(wss);