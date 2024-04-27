"use client";
import { PropsWithChildren } from "react";

type Props = {
  onClick: () => void;
  fullWidth?: boolean;
  type?: "button" | "submit";
};

export function Button({
  onClick,
  children,
  fullWidth,
  type = "button",
}: PropsWithChildren<Props>) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ backgroundColor: "#739552" }}
      className={` px-3 font-bold py-2 rounded-md ${fullWidth ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}
