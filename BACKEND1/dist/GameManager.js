"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        console.log("New user connected.");
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        console.log("User disconnected.");
        this.users = this.users.filter(user => user !== socket);
        this.games = this.games.filter(game => game.player1 !== socket && game.player2 !== socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            console.log("Received message:", message);
            if (message.type === messages_1.INIT_GAME) {
                console.log("Player wants to start a game.");
                if (this.pendingUser) {
                    console.log("Starting a new game.");
                    const game = new Game_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    console.log("Waiting for another player to join.");
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("Processing move request.");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
                else {
                    console.log("Game not found for this player.");
                }
            }
        });
        socket.on("close", () => this.removeUser(socket));
    }
}
exports.GameManager = GameManager;
