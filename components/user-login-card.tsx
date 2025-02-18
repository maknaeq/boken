import React from "react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function UserLoginCard() {
  const session = await auth();
  const user = session?.user;

  if (session) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Avatar>
          <AvatarImage src={user?.image as string} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span>{user?.name}</span>
        <Button variant="default">Déconnexion</Button>
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
