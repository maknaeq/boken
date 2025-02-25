import { auth } from "@/lib/auth";
import { getCurrentUserByEmail } from "@/app/actions/userActions";
import CreateTripForm from "@/components/create-trip-form";
import { redirect } from "next/navigation";

export default async function CreateTripPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getCurrentUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="hidden md:block">{/* Sidebar content */}</aside>

        <div className="md:col-span-3">
          <h1 className="mb-6 text-2xl font-bold">Créer un nouveau voyage</h1>
          <CreateTripForm user={user} />
        </div>
      </div>
    </main>
  );
}
