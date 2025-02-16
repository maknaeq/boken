import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Darumadrop_One } from "next/font/google";
import "../globals.css";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${brocolageGrotesque.className}`}>
        <div className="flex items-center justify-between p-3">
          <Menu />
          <div>
            <h1>Bōken</h1>
            <span className={darumadropOne.className}>ぼうけん</span>
          </div>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button variant="default">Inscription</Button>
            </Link>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
