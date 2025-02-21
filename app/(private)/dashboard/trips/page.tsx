import { getAllUserTripsInfos } from "@/app/actions/tripActions";
import { FiltersSection } from "@/components/filters-section";
import { CreateTripCard } from "@/components/create-trip-card";
import { TripCard } from "@/components/trip-card";
import RandomImage from "@/public/images/register-splash_3.jpg";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentUserByEmail } from "@/app/actions/userActions";
import Link from "next/link";

export default async function TripsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getCurrentUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }
  const trips = await getAllUserTripsInfos(user[0].id);

  return (
    <div className="mx-auto max-w-[1280px]">
      <FiltersSection />

      <div className="flex grid-cols-4 flex-col gap-8 md:grid md:gap-12">
        <CreateTripCard user={user} />

        <TripCard
          image={RandomImage}
          title="Thailand"
          dates="1 Mai 2025 - 15 Mai 2025"
        />

        {trips?.map(
          (trip) =>
            trip.startDate &&
            trip.endDate && (
              <Link key={trip.id} href={`/dashboard/trips/${trip.id}`}>
                <TripCard
                  image={RandomImage}
                  title={trip.title}
                  dates={`${format(trip.startDate, "PPP", { locale: fr })} - ${format(trip.endDate, "PPP", { locale: fr })}`}
                />
              </Link>
            ),
        )}
      </div>
    </div>
  );
}
