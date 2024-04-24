import { useNavigate } from "react-router-dom";
import { Button } from "../components/helper/Button";

export default function Landing() {
  const navigate = useNavigate();

  const handlePlayOnline = () => {
    navigate("/game");
  };

  return (
    <div className="grid  grid-cols-1 md:grid-cols-2 gap-5">
      <img className="w-[500px] m-auto" src="/chessboard.jpeg" />
      <div className="flex flex-col gap-2 justify-center items-center text-white">
        <div className="font-bold text-3xl">Play chess online on #3 site!</div>
        <Button onClick={handlePlayOnline}>Play Online</Button>
      </div>
    </div>
  );
}
