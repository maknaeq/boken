import SignIn from "@/components/SignIn";
import { auth } from "@/auth";
import SignOut from "@/components/SignOut";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  console.log(user);
  return (
    <div>
      <h1>Bōken</h1>
      {user ? <SignOut /> : <SignIn />}
    </div>
  );
}
