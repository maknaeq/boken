import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Darumadrop_One } from "next/font/google";
import "../globals.css";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

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
  const session = await auth();
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
            {session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button>Déconnexion</Button>
              </form>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Connexion</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default">Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
