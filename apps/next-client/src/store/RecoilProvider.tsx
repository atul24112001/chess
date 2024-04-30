"use client";

import React, { PropsWithChildren, useEffect } from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { User } from "./atoms/user";
import Wrapper from "@/components/Wrapper";

type Props = {
  user?: User;
};

export default function RecoilProvider({
  children,
  user,
}: PropsWithChildren<Props>) {
  return (
    <RecoilRoot>
      <Wrapper user={user}>{children}</Wrapper>
    </RecoilRoot>
  );
}
