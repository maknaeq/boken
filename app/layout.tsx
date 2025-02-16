import type { Metadata } from "next";
import { Bricolage_Grotesque, Darumadrop_One } from "next/font/google";
import "./globals.css";
import { Menu } from "lucide-react";

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
        </div>
        {children}
      </body>
    </html>
  );
}
