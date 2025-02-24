"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const ws_1 = require("ws");
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        console.log("Game started between two players.");
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: { color: "white" }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: { color: "black" }
        }));
    }
    makeMove(socket, move) {
        console.log("Move received:", move, "from player:", socket === this.player1 ? "Player 1 (White)" : "Player 2 (Black)");
        const currentTurn = this.board.turn();
        if ((currentTurn === "w" && socket !== this.player1) ||
            (currentTurn === "b" && socket !== this.player2)) {
            console.log("Invalid turn. Not this player's turn.");
            return;
        }
        const result = this.board.move({ from: move.from, to: move.to });
        if (!result) {
            console.log("Invalid move attempted:", move);
            return;
        }
        console.log("Move successful:", result);
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? "black" : "white";
            console.log("Game over! Winner:", winner);
            this.player1.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
            this.player2.send(JSON.stringify({ type: messages_1.GAME_OVER, payload: { winner } }));
            return;
        }
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        console.log(`Sending move to opponent: ${opponent === this.player1 ? "Player 1 (White)" : "Player 2 (Black)"}`);
        if (opponent.readyState === ws_1.WebSocket.OPEN) {
            opponent.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
        else {
            console.log("Opponent WebSocket is closed. Cannot send move.");
        }
    }
}
exports.Game = Game;
