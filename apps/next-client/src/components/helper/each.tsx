import React, { Children } from "react";

type Props<T> = {
  render: (data: T, index: number) => React.ReactNode;
  of: T[];
};

export const Each = <T,>({ render, of }: Props<T>): any =>
  Children.toArray(of.map((item: T, index: number) => render(item, index)));
