import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { Route, Routes } from "react-router-dom";
import { useUser } from "@repo/store";

import Landing from "./view/Landing";
import Loader from "./components/helper/Loader";
import Auth from "./view/Auth";

const RouteComponent = () => {
  const user = useUser();
  console.log({ user });
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/authenticate" element={<Auth />} />
    </Routes>
  );
};

export default function App() {
  return (
    <div className="min-h-screen p-4 pt-10 text-white bg-slate-950">
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          <RouteComponent />
        </Suspense>
      </RecoilRoot>
    </div>
  );
}
