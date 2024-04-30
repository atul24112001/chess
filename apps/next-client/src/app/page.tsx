import Landing from "@/view/Landing";
import axios from "axios";
import { cookies } from "next/headers";

export default async function Home() {
  let games: GameType[] | undefined;

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken) {
    games = await axios
      .get(`${process.env.FRONTEND_URL}/api/game`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || ""}`,
        },
      })
      .then(({ data }) => data?.data)
      .catch((err: any) => console.log(err));
  }

  return <Landing ssrGames={games} />;
}
