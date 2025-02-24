
import { ChessBoard } from "../components/ChessBoard";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSockets";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";


export const INIT_GAME = 'INIT_GAME';
export const MOVE = 'MOVE';
export const GAME_OVER = 'GAME_OVER';


export const Game = () => {
    const socket = useSocket();
    const [chess , setchess] = useState(new Chess());
    const [board , setBoard] = useState(chess .board( ));  
    useEffect(() => {
        if (!socket) return; 

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case "INIT_GAME":
                    setchess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialized");
                    break;
                case "MOVE":
                    const move = message.move;
                    chess.move(move);
                    setBoard(chess.board());  
                    console.log("Move made");
                    break;
                case "GAME_OVER":
                    console.log("Game over");
                    break;
            }
        };
    }, [socket]);


    if(!socket)return <div>Loading...</div>

    return (
        <div className="justify-center flex">
            <div className="pt-8 mx-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4  w-full flex justify-center">
                        <ChessBoard socket = {socket} board = {board} />
                    </div>
                    <div className="pt-8">
                    <div className="col-span-2 bg-slate-800 w-full flex justify-center">
                        <Button onClick={()=>{
                            socket.send(JSON.stringify({type:INIT_GAME}))
                        }} > 
                          Play 
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};