import { Button } from "@/components/ui/button";
import { BadgeDollarSign, Plus, Ruler, Wifi } from "lucide-react";
import MagneticImage from "@/components/magnetic-image";

import Spain from "@/public/images/spain-bento.jpg";
import Japan from "@/public/images/japan-bento.jpg";
import Mexico from "@/public/images/mexico-bento.jpg";
import Danemark from "@/public/images/danemark-bento.jpg";

export default function Home() {
  return (
    <div>
      <div className="landing-image mx-auto mb-10 h-[80vh] max-h-[1980px] max-w-[1280px] rounded-xl">
        {/* <HomeVideo /> */}
        <div className="flex h-full w-full flex-col justify-center space-y-5 text-background md:pl-20">
          <div className="relative mt-10 w-fit p-4">
            <h2 className="relative z-50 mb-3 max-w-[600px] text-7xl font-semibold">
              Planifier votre voyage solo{" "}
            </h2>
            <span className="absolute w-fit -rotate-3 bg-yellow-300 p-2 text-5xl font-semibold text-foreground">
              sans stress
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] py-16 md:py-24">
        <h2 className="text-5xl font-semibold md:text-center">
          Pourquoi choisir Bōken ?
        </h2>
        <div className="mt-20 grid justify-center gap-12 md:mt-20 md:grid-cols-[max-content,max-content]">
          <div className="space-y-5 md:max-w-72">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300">
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
          <div className="space-y-5 md:max-w-72">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300">
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
          <div className="space-y-5 md:max-w-72">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300">
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
          <div className="mx-auto flex w-full items-center justify-center space-y-5 rounded-xl md:w-[288px]">
            <Button variant="bento" className="">
              <Plus />
              Créer mon itinéraire
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] py-24">
        <h3 className="text-5xl font-semibold md:text-center">
          Nos{" "}
          <span className="underline decoration-yellow-300 decoration-wavy underline-offset-4">
            TOP
          </span>{" "}
          destinations
        </h3>
        <div className="mt-20 grid grid-cols-10 grid-rows-2 gap-3">
          <div className="relative col-span-5 md:col-span-6">
            <MagneticImage
              src={Spain}
              alt="Spain"
              title="🇪🇸 Espagne"
              description="Barcelone"
            />
          </div>
          <div className="relative col-span-5 md:col-span-4">
            <MagneticImage
              src={Japan}
              alt="Japan"
              title="🇯🇵 Japon"
              description="Tokyo"
            />
          </div>
          <div className="relative col-span-5 md:col-span-3">
            <MagneticImage
              src={Mexico}
              alt="Mexico"
              title="🇲🇽 Mexique"
              description="Mexico city"
            />
          </div>
          <div className="relative col-span-5 md:col-span-7">
            <MagneticImage
              src={Danemark}
              alt="Danemark"
              title="🇩🇰 Danemark"
              description="Copenhague"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
