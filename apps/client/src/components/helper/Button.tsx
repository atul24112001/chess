import { PropsWithChildren } from "react";

type Props = {
  onClick: () => void;
  fullWidth?: boolean;
};

export function Button({
  onClick,
  children,
  fullWidth,
}: PropsWithChildren<Props>) {
  return (
    <button
      onClick={onClick}
      className={`bg-green-500 px-3 py-2 rounded-md ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {children}
    </button>
  );
}
