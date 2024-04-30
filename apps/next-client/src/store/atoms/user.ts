import { atom, selector } from "recoil";

// export const BACKEND_URL = `https://chess.atulmorchhlay.com/api`;
export const BACKEND_URL = `http://localhost8000/api`;

export interface User {
  id: string;
  email: string;
  name: string;
}

export const userAtom = atom<User | null>({
  key: "user",
  default: null,
});
