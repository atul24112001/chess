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
      onClick={onClick}
      type={type}
      className={`bg-[#739552] text-xs md:text-sm font-bold px-3 py-2 rounded-md ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}
