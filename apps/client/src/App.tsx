import { Suspense, useEffect } from "react";
import { RecoilRoot } from "recoil";
import { Route, Routes } from "react-router-dom";

import Landing from "./view/Landing";
import Loader from "./components/helper/Loader";
import Auth from "./view/Auth";
import { useUser } from "@repo/store/useUser";
import Game from "./view/Game";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/helper/Button";
import GameDetails from "./view/GameDetails";

const RouteComponent = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/authenticate");
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  console.log({ user });

  return (
    <>
      <div className="px-[5%] lg:px-[10%] shadow-lg shadow-[#ffffff3c] py-4 m-auto flex justify-between items-center">
        <div className="flex items-end">
          <img alt="logo" className="w-12" src="/wp.png" />
          <h1 className="font-bold text-2xl lg:text-3xl text-[#739552]">
            Chess.com
          </h1>
        </div>
        {user && (
          <div className="flex gap-2">
            <div className="hidden md:block text-right">
              <p className="font-bold ">{user.name}</p>
              <p className="text-sm text-gray-300">{user.email}</p>
            </div>
            <Button type="button" onClick={logoutHandler}>
              Logout
            </Button>
          </div>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/authenticate" element={<Auth />} />
        <Route path="/game/random" element={<Game />} />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <div className="min-h-screen  text-white bg-[#302e2b]">
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          <RouteComponent />
        </Suspense>
      </RecoilRoot>
    </div>
  );
}
