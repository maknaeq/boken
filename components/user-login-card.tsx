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
import RedirectButton from "./redirect-button";
import { getCurrentUserByEmail } from "@/app/actions/userActions";

async function UserLoginCard() {
  const session = await auth();
  const user = await getCurrentUserByEmail(session?.user?.email as string);

  if (!session || !user || user.length === 0) {
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

  const currentUser = user[0];
  const displayName =
    currentUser.name ||
    `${currentUser.firstName} ${currentUser.lastName?.toUpperCase()}` ||
    currentUser.email ||
    "Inconnu";

  return (
    <div className="flex items-center space-x-2">
      <RedirectButton variant={"outline"} href="/dashboard/trips">
        Mes voyages
      </RedirectButton>

      <DropdownMenu>
        <DropdownMenuTrigger className="relative">
          <Avatar className="ring-gray-900 ring-offset-2 transition-all ease-out hover:ring-2">
            <AvatarImage src={currentUser.image as string} />
            <AvatarFallback className="bg-yellow-300">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-nowrap rounded-xl" align="end">
          <div className="flex space-x-3 p-2">
            <Avatar>
              <AvatarImage src={currentUser.image as string} />
              <AvatarFallback className="bg-yellow-300">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <DropdownMenuLabel className="p-0 font-normal">
                {displayName}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="text-nowrap p-0 font-normal text-gray-500">
                {currentUser.email}
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
    </div>
  );
}

export default UserLoginCard;
