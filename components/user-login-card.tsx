import React from "react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

async function UserLoginCard() {
  const session = await auth();
  const user = session?.user;
  const name = user?.name || user?.email;
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          <Avatar className="ring-offset-2 transition-all ease-out hover:ring-2">
            <AvatarImage src={user?.image as string} />
            <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-nowrap rounded-xl" align="end">
          <div className="flex space-x-3 p-2">
            <Avatar>
              <AvatarImage src={user?.image as string} />
              <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <DropdownMenuLabel className="p-0 font-normal">
                {user?.name || "First LASTNAME"}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-nowrap p-0 font-normal text-gray-500">
                {user?.email}
              </DropdownMenuLabel>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div className="text-gray-500">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full cursor-pointer">
                  <LogOut />
                  Déconnexion
                </button>
              </DropdownMenuItem>
            </form>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <>
      <Link href="/login">
        <Button variant="ghost">Connexion</Button>
      </Link>
      <Link href="/signup">
        <Button variant="default">Inscription</Button>
      </Link>
    </>
  );
}

export default UserLoginCard;
