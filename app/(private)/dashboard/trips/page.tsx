import { getAllUserTrips } from "@/app/actions/tripActions";
import { FiltersSection } from "@/components/filters-section";
import { CreateTripCard } from "@/components/create-trip-card";
import { TripCard } from "@/components/trip-card";
import RandomImage from "@/public/images/register-splash_3.jpg";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCurrentUserByEmail } from "@/app/actions/userActions";

export default async function TripsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getCurrentUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }
  const trips = await getAllUserTrips(user[0].id);

  return (
    <div className="mx-auto max-w-[1280px]">
      <FiltersSection />

      <div className="grid-cols-4 gap-12 space-y-12 md:grid md:space-y-0">
        <CreateTripCard />

        <TripCard
          image={RandomImage}
          title="Thailand"
          dates="1 Mai 2025 - 15 Mai 2025"
        />

        {trips?.map(
          (trip) =>
            trip.startDate &&
            trip.endDate && (
              <TripCard
                key={trip.id}
                image={RandomImage}
                title={trip.title}
                dates={`${format(trip.startDate, "PPP", { locale: fr })} - ${format(trip.endDate, "PPP", { locale: fr })}`}
              />
            ),
        )}
      </div>
    </div>
  );
}
