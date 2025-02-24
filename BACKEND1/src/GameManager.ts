import { WebSocketServer, WebSocket } from "ws";
import { Game } from "./Game";
import { MOVE } from "./messages";

export class GameManager {
    private players: WebSocket[] = [];
    private game: Game | null = null;

    constructor(server: WebSocketServer) {
        server.on("connection", (ws) => {
            console.log("🔗 New player connected.");

            this.players.push(ws);

            // If we have two players, start a game
            if (this.players.length === 2) {
                this.game = new Game(this.players[0], this.players[1]);
            }

            ws.on("message", (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log("📨 Received WebSocket message:", data);

                    if (data.type === MOVE && this.game) {
                        console.log("🎯 Processing move:", data.payload);
                        this.game.makeMove(ws, data.payload);
                    }
                } catch (error) {
                    console.error("❌ Error parsing message:", error);
                }
            });

            ws.on("close", () => {
                console.log("❌ A player disconnected.");
                this.players = this.players.filter(player => player !== ws);
                this.game = null; // Reset game if a player leaves
            });
        });
    }
}