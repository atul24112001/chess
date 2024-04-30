import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilProvider from "@/store/RecoilProvider";
import { cookies } from "next/headers";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chess.com",
  description:
    "This is copy of of chess.com createBy https://github.com/atul24112001 for learning purposes",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let user: any;

  if (accessToken) {
    console.log(accessToken);
    // user = await fetch(, {
    //   method: "GET",
    //   headers: ,
    // })
    user = await axios
      .get(`${process.env.FRONTEND_URL}/api/auth/verify`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken || ""}`,
        },
      })
      .then(({ data }) => data?.data?.[0])
      .catch((err: any) => console.log(err));
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilProvider user={user}>{children}</RecoilProvider>
      </body>
    </html>
  );
}
