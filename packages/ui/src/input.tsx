import "./index.css";

import React from "react";

type Props = {
  title: string;
  value: any;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  errorText?: string;
};

export function Input({
  placeholder,
  title,
  value,
  onChange,
  name,
  type = "text",
  errorText,
}: Props) {
  return (
    <div className="mb-3">
      <div className="text-sm mb-1 pl-2 font-semibold">{title}</div>
      <input
        style={{ border: "1px solid #ffffff1a", borderRadius: "5px" }}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-transparent py-1 px-3 w-full focus:outline-none active:outline-none"
        placeholder={placeholder}
      />
      {errorText && (
        <div className="text-xs font-bold text-red-600">{errorText}</div>
      )}
    </div>
  );
}
