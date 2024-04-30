import Landing from "@/view/Landing";
import { cookies } from "next/headers";

export default async function Home() {
  let games: GameType[] | undefined;

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (accessToken) {
    games = await fetch(`${process.env.FRONTEND_URL}/api/game`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken || ""}`,
      },
    })
      .then((resp: any) => {
        if (resp.status == 200) {
          return resp.json();
        }
      })
      .then((data: any) => data?.data)
      .catch((err: any) => console.log(err));
  }

  return <Landing ssrGames={games} />;
}
