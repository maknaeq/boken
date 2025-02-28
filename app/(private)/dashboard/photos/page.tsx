import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentUserByEmail } from "@/app/actions/userActions";
import { getAllUserPhotos } from "@/app/actions/photoActions";
import Image from "next/image";
import { ToastContainer } from "@/components/toast-container";

export default async function PhotosPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getCurrentUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  const photos = await getAllUserPhotos(user[0].id);

  return (
    <div className="mx-auto max-w-[1280px] p-4">
      <ToastContainer />
      <h1 className="mb-6 text-2xl font-bold">Mes Photos</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos?.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={photo.url}
              alt={photo.url}
              fill
              className="object-cover transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
