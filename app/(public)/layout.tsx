import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Darumadrop_One } from "next/font/google";
import "../globals.css";
import { Menu } from "lucide-react";
import UserLoginCard from "@/components/user-login-card";

const brocolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
});

const darumadropOne = Darumadrop_One({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boken",
  description: "Souvenir et planification de voyage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${brocolageGrotesque.className}`}>
        <div className="flex items-center justify-between p-3">
          <Menu />

          <Link href={"/"} className="relative">
            <h1 className="text-xl font-semibold">Bōken</h1>
            <span
              className={`${darumadropOne.className} absolute top-5 text-xs opacity-50`}
            >
              ぼうけん
            </span>
          </Link>
          <div className="space-x-2">
            <UserLoginCard />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
