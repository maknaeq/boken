import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Darumadrop_One } from "next/font/google";
import "@/app/globals.css";
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
        <div className="absolute z-50 h-52 w-full bg-gradient-to-b from-gray-900 to-gray-50/0 px-3 py-5 text-background">
          <div className="mx-auto flex w-full max-w-[1000px] items-start justify-between">
            <Link href={"/"} className="relative">
              <h1 className="text-xl font-semibold">Bōken</h1>
              <span
                className={`${darumadropOne.className} absolute top-5 text-xs`}
              >
                ぼうけん
              </span>
            </Link>
            <div className="space-x-2">
              <UserLoginCard />
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
