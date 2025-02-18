import React from "react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function UserLoginCard() {
  const session = await auth();

  if (session) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>Déconnexion</Button>
      </form>
    );
  }
  return (
    <>
      <Link href="/login">
        <Button variant="outline">Connexion</Button>
      </Link>
      <Link href="/signup">
        <Button variant="default">Inscription</Button>
      </Link>
    </>
  );
}

export default UserLoginCard;
