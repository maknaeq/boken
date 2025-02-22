import { getTripById, getTripStages } from "@/app/actions/tripActions";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import RandomImage from "@/public/images/register-splash_3.jpg";
import RandomImage2 from "@/public/images/register-splash_2.jpg";
import RandomImage3 from "@/public/images/register-splash_1.jpg";
import { Button } from "@/components/ui/button";
import { Clock, Heart, Hotel, Share2 } from "lucide-react";
import { CATEGORY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CreateTripStage } from "@/components/create-trip-stage";
import { redirect } from "next/navigation";
import { getCurrentUserByEmail } from "@/app/actions/userActions";
import StageAccordion from "@/components/stage-accordion";

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

  if (!currentTrip || currentTrip.length === 0) {
    redirect("/dashboard/trips");
  }

  return (
    <div className="mx-auto max-w-[1280px] py-4">
      {currentTrip && currentTrip[0].startDate && currentTrip[0].endDate && (
        <div>
          <div className="items-center justify-between md:flex">
            <div>
              <h2 className="text-3xl font-semibold">{currentTrip[0].title}</h2>
              <p>
                Du {format(currentTrip[0].startDate, "PPP", { locale: fr })} au{" "}
                {format(currentTrip[0].endDate, "PPP", { locale: fr })}
              </p>
            </div>
            <div className="flex space-x-2 pt-5 md:block">
              <Button variant="outline" className="flex-1">
                <Share2 />
                Partager
              </Button>
              <Button variant="outline" className="flex-1">
                <Heart />
                Favori
              </Button>
            </div>
          </div>
          <div className="grid h-[460px] gap-3 py-3 md:grid-cols-3">
            <div className="col-span-2 row-span-2 w-full overflow-hidden rounded-xl">
              <Image
                src={RandomImage}
                alt="trip image"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-full overflow-hidden rounded-xl">
              <Image
                src={RandomImage2}
                alt="trip image"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-full overflow-hidden rounded-xl">
              <Image
                src={RandomImage3}
                alt="trip image"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="py-4">
            <div className="grid grid-cols-3 gap-32">
              <div className="space-y-4 rounded-xl border p-4 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-xl">Détails</h3>
                  <div className="flex flex-wrap items-center gap-1">
                    <div
                      className={cn(
                        "flex w-fit items-center space-x-2 rounded-lg border px-4 py-2 text-sm",
                      )}
                    >
                      {CATEGORY[currentTrip[0].category]}
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
                    <div className="flex w-fit items-center space-x-2 rounded-lg border px-4 py-2 text-sm">
                      <Hotel size={15} />
                      <span>9 endroits</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Prix</span>
                    <span className="text-xl">{currentTrip[0].price}€</span>
                  </div>
                  <CreateTripStage user={currentUser} tripId={id} />
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-xl">Description</h3>
                <p className="font-light text-gray-500">
                  {currentTrip[0].description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-32">
              <div></div>
              {
                <div className="col-span-2 py-10">
                  <h3 className="text-xl">Mon itinéraire</h3>
                  <div className="space-y-4">
                    {tripStages.map((stage, index) => (
                      <StageAccordion
                        key={stage.id}
                        stage={stage}
                        index={index}
                        user={currentUser}
                      />
                    ))}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
