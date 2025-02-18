import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div>
      Bienvenue {session?.user?.email}
      <p>{session ? "Vous êtes connecté" : "Vous n'êtes pas connecté"}</p>
    </div>
  );
}
