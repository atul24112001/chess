import { atom, selector } from "recoil";

export const BACKEND_URL = `http://chess.atulmorchhlay.com/api`;

export interface User {
  id: string;
  email: string;
  name: string;
}

export const userAtom = atom<User>({
  key: "user",
  default: selector({
    key: "user/default",
    get: async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          return data.data[0];
        }
      } catch (e) {
        console.error(e);
      }
      return null;
    },
  }),
});
