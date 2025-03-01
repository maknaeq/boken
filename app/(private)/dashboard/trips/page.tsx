import {
  getAllUserTripsInfos,
  getFavoriteUserTrips,
} from "@/app/actions/tripActions";
import { FiltersSection } from "@/components/filters-section";
import { CreateTripCard } from "@/components/create-trip-card";
import { TripCard } from "@/components/trip-card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentUserByEmail } from "@/app/actions/userActions";
import Link from "next/link";
import { ToastContainer } from "@/components/toast-container";
import { getFavorites } from "@/app/actions/favoriteActions";

type searchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function TripsPage({
  searchParams,
}: {
  searchParams: searchParams;
}) {
  const session = await auth();
  const srcParams = await searchParams;

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getCurrentUserByEmail(session.user.email);
  const favorites = await getFavorites(user?.[0].id as string);
  const showFavorites = srcParams.favorites === "true";

  function isFavorite(tripId: string) {
    return !!favorites.some((fav) => fav.tripId === tripId);
  }

  if (!user) {
    redirect("/login");
  }

  const trips = showFavorites
    ? await getFavoriteUserTrips(user[0].id)
    : await getAllUserTripsInfos(user[0].id);

  console.log("tripsSSS", trips);

  return (
    <div className="mx-auto max-w-[1280px]">
      <ToastContainer />
      <FiltersSection />

      <div className="flex grid-cols-4 flex-col gap-8 md:grid md:gap-12">
        <CreateTripCard user={user} />

        {trips?.map(
          (trip) =>
            trip.startDate &&
            trip.endDate && (
              <Link key={trip.id} href={`/dashboard/trips/${trip.id}`}>
                <TripCard
                  image={trip.imageCover}
                  title={trip.title}
                  dates={`${format(trip.startDate, "PPP", { locale: fr })} - ${format(trip.endDate, "PPP", { locale: fr })}`}
                  isFavorite={isFavorite(trip.id as string)}
                />
              </Link>
            ),
        )}
      </div>
    </div>
  );
}
