"use client";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/helper/Button";
import { User, userAtom } from "@/store/atoms/user";
import Cookie from "js-cookie";
import Loader from "./helper/Loader";

type Props = {
  user?: User;
};

const Wrapper = ({ children, user }: PropsWithChildren<Props>) => {
  const router = useRouter();
  const path = usePathname();
  const setUser = useSetRecoilState(userAtom);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUser(user);
    } else {
      if (!path.includes("authentication")) {
        router.replace("/authentication");
      }
    }
    setLoading(false);
  }, [user]);

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    Cookie.remove("accessToken");
    router.refresh();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen  text-white bg-[#302e2b]">
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
      <div>{children}</div>
    </div>
  );
};

export default Wrapper;
