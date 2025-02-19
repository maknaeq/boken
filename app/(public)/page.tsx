import { BadgeDollarSign, Ruler, Wifi } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="landing-image mx-auto h-[80vh] max-w-[1280px] rounded-xl">
        {/* <HomeVideo /> */}
        <div className="flex h-full w-full flex-col justify-end space-y-5 p-4 text-background">
          <div className="relative w-fit p-4">
            <h2 className="relative z-50 max-w-[600px] text-7xl font-semibold">
              Planifier votre voyage solo{" "}
            </h2>
            <span className="absolute w-fit -rotate-3 bg-yellow-300 p-2 text-5xl font-semibold text-foreground">
              sans stress
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] py-24">
        <h2 className="text-5xl font-semibold md:text-center">
          Pourquoi choisir Bōken ?
        </h2>
        <div className="grid-cols-2 space-y-12 py-20 sm:grid sm:gap-5 sm:space-y-0 lg:grid-cols-3">
          <div className="mx-auto space-y-5 md:max-w-72">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <Ruler />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl">Un voyage taillé sur mesure</h3>
              <p className="font-extralight">
                Un plan de voyage 100 % personnalisé en fonction de vos envies,
                budget et durée de séjour.
              </p>
            </div>
          </div>
          <div className="mx-auto space-y-5 md:max-w-72">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <Wifi />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl">
                Toujours disponible, même sans internet
              </h3>
              <p className="font-extralight">
                Consultez vos itinéraires et vos cartes en mode hors ligne,
                idéal pour les aventuriers.
              </p>
            </div>
          </div>
          <div className="mx-auto space-y-5 md:max-w-72">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <BadgeDollarSign />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl">Voyagez malin, dépensez mieux</h3>
              <p className="font-extralight">
                Suggestions adaptées à votre budget et un itinéraire optimisé
                pour ne rien manquer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
