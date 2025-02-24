import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl">
                {/* Chessboard Image */}
                <div className="flex justify-center">
                    <img src="/chessboard.jpeg" className="max-w-96 rounded-lg shadow-lg" alt="Chessboard" />
                </div>
                
                {/* Text & Button Section */}
                <div className="flex flex-col items-start">
                    <h1 className="text-4xl font-bold">
                        Play chess online on the #2 Site!
                    </h1>
                     <div className ="mt-8 flex justify-center">
                     <Button onClick={()=>{
                        navigate( "/game")
                    }} > 
                        Play Online
                    </Button>
                     </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Landing;