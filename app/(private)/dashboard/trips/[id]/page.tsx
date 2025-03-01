import { getTripById, getTripStages } from "@/app/actions/tripActions";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { Clock, Hotel } from "lucide-react";
import { TRIP_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CreateTripStage } from "@/components/create-trip-stage";
import { redirect } from "next/navigation";
import { getCurrentUserByEmail } from "@/app/actions/userActions";
import StageAccordion from "@/components/stage-accordion";
import BackButton from "@/components/back-button";
import TripActions from "@/components/trip-actions";
import "leaflet/dist/leaflet.css";
import LeafletMap from "@/components/leaflet-map";
import { getPhotosByTripId } from "@/app/actions/placeActions";
import ShareButton from "@/components/share-button";
import FavoriteButton from "@/components/favorite-button";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const id = (await params).id;
  const currentTrip = await getTripById(id, user.id as string);
  const currentUser = await getCurrentUserByEmail(user.email as string);
  const tripStages = await getTripStages(id);
  const tripPhotos = await getPhotosByTripId(id);

  if (!currentTrip || currentTrip.length === 0) {
    redirect("/dashboard/trips");
  }

  const isOwner = currentTrip[0].isOwner;

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/trips/${id}`;

  const locations = tripStages.map((place) => ({
    latitude: parseFloat(place.latitude as string),
    longitude: parseFloat(place.longitude as string),
    name: place.title,
  }));

  if (!currentTrip || currentTrip.length === 0) {
    redirect("/dashboard/trips");
  }

  const transformedTrip = {
    id: currentTrip[0].id,
    userId: currentTrip[0].userId,
    title: currentTrip[0].title,
    description: currentTrip[0].description,
    price: currentTrip[0].price,
    category: currentTrip[0].category,
    startDate: currentTrip[0].startDate?.toISOString() || null,
    endDate: currentTrip[0].endDate?.toISOString() || null,
    createdAt: currentTrip[0].createdAt.toISOString(),
  };

  return (
    <div className="mx-auto max-w-[1280px] py-4">
      {currentTrip && currentTrip[0].startDate && currentTrip[0].endDate && (
        <div>
          <BackButton />
          <div className="items-center justify-between md:flex">
            <div>
              <h2 className="text-3xl font-semibold">{currentTrip[0].title}</h2>
              <p>
                Du {format(currentTrip[0].startDate, "PPP", { locale: fr })} au{" "}
                {format(currentTrip[0].endDate, "PPP", { locale: fr })}
              </p>
            </div>
            <div className="flex space-x-2 pt-5 md:block">
              <ShareButton currentTrip={currentTrip} shareUrl={shareUrl} />
              <FavoriteButton userId={user.id as string} tripId={id} />
              {isOwner && (
                <TripActions trip={transformedTrip} user={currentUser} />
              )}
            </div>
          </div>
          <div className="grid h-[460px] gap-3 py-3 md:grid-cols-3">
            <div className="col-span-2 row-span-2 w-full overflow-hidden rounded-xl">
              <LeafletMap locations={locations} />
            </div>
            {tripPhotos.length !== 0 ? (
              <>
                <div className="w-full overflow-hidden rounded-xl">
                  <Image
                    src={tripPhotos[0]?.url}
                    alt="trip image"
                    width={400}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full overflow-hidden rounded-xl">
                  {tripPhotos[1] ? (
                    <Image
                      src={tripPhotos[1].url}
                      alt="trip image"
                      width={400}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center border border-dashed text-sm">
                      <p className="font-light text-gray-500">
                        Aucune image pour le moment
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed text-sm">
                  <p className="font-light text-gray-500">
                    Aucune image pour le moment
                  </p>
                </div>
                <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed text-sm">
                  <p className="font-light text-gray-500">
                    Aucune image pour le moment
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="py-4">
            <div className="flex flex-col gap-20 md:grid md:grid-cols-3 md:gap-32">
              <div className="order-2 space-y-4 rounded-xl border p-4 shadow-sm md:order-1">
                <div className="space-y-2">
                  <h3 className="text-xl">Détails</h3>
                  <div className="flex flex-wrap items-center gap-1">
                    <div
                      className={cn(
                        "flex w-fit items-center space-x-2 rounded-lg border px-4 py-2 text-sm",
                      )}
                    >
                      {TRIP_CATEGORIES[currentTrip[0].category]}
                      <span>{currentTrip[0].category}</span>
                    </div>
                    <div className="flex w-fit items-center space-x-2 rounded-lg border px-4 py-2 text-sm">
                      <Clock size={15} />
                      <span>
                        {Math.ceil(
                          (new Date(currentTrip[0].endDate).getTime() -
                            new Date(currentTrip[0].startDate).getTime()) /
                            (1000 * 60 * 60 * 24) +
                            1,
                        )}{" "}
                        jours
                      </span>
                    </div>
                    {tripStages.length > 0 && (
                      <div className="flex w-fit items-center space-x-2 rounded-lg border px-4 py-2 text-sm">
                        <Hotel size={15} />
                        <span>{tripStages.length} endroits</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Budget</span>
                    <span className="text-xl">{currentTrip[0].price}€</span>
                  </div>
                  {isOwner && (
                    <CreateTripStage user={currentUser} tripId={id} />
                  )}
                </div>
              </div>
              <div className="order-1 col-span-2 md:order-2">
                <h3 className="text-xl">Description</h3>
                <p className="font-light text-gray-500">
                  {currentTrip[0].description}
                </p>
              </div>
            </div>
            <div className="grid-cols-3 gap-32 md:grid">
              <div className="hidden md:block"></div>
              {tripStages.length > 0 && (
                <div className="py-10 md:col-span-2">
                  {tripStages.length > 0 && (
                    <h3 className="text-xl">Mon itinéraire</h3>
                  )}
                  <div className="space-y-4">
                    {tripStages.map((stage, index) => (
                      <StageAccordion
                        key={stage.id}
                        stage={stage}
                        index={index}
                        user={currentUser}
                        isOwner={isOwner}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
