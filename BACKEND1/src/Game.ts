import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE, ERROR } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        console.log("♟️ Game started between two players.");

        // Assign colors
        this.player1.send(JSON.stringify({ type: INIT_GAME, payload: { color: "white" } }));
        this.player2.send(JSON.stringify({ type: INIT_GAME, payload: { color: "black" } }));
    }

    makeMove(socket: WebSocket, move: { from?: string; to?: string }) {
        console.log("📩 Move received:", move, "from", 
            socket === this.player1 ? "Player 1 (White)" : "Player 2 (Black)");

        // Validate move object
        if (!move || !move.from || !move.to) {
            console.log("❌ Invalid move format:", move);
            socket.send(JSON.stringify({ type: ERROR, message: "Invalid move format." }));
            return;
        }

        // Validate turn
        const currentTurn = this.board.turn();
        if ((currentTurn === "w" && socket !== this.player1) ||
            (currentTurn === "b" && socket !== this.player2)) {
            console.log("❌ Invalid turn. Not this player's turn.");
            socket.send(JSON.stringify({ type: ERROR, message: "Not your turn." }));
            return;
        }

        // Attempt move
        const result = this.board.move({ from: move.from, to: move.to });
        if (!result) {
            console.log("❌ Illegal move:", move);
            socket.send(JSON.stringify({ type: ERROR, message: "Illegal move." }));
            return;
        }

        console.log("✅ Move successful:", result);

        // Check game over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            console.log("🏆 Game over! Winner:", winner);
            this.player1.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: GAME_OVER, payload: { winner } }));
            return;
        }

        // Send move to opponent
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        if (opponent.readyState === WebSocket.OPEN) {
            console.log("📤 Sending move to opponent:", move);
            opponent.send(JSON.stringify({ type: MOVE, payload: move }));
        } else {
            console.log("⚠️ Opponent disconnected.");
        }
    }
}