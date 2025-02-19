import HomeVideo from "@/components/home-video";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="landing-image mx-auto h-[80vh] max-w-[1280px] rounded-xl">
        {/* <HomeVideo /> */}
        <div className="flex h-full w-full flex-col justify-end space-y-5 p-4 text-background">
          <div className="relative w-fit">
            <h2 className="relative z-50 max-w-[600px] text-7xl font-semibold">
              Planifier votre voyage solo{" "}
            </h2>
            {/* <span className="w-fit bg-yellow-300 p-2 text-5xl font-semibold text-foreground">
              sans stress
            </span> */}
          </div>
          {/* <p>Un itinéraire personnalisé en quelques clics.</p> */}
        </div>
      </div>
    </div>
  );
}
