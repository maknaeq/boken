import { getTripById } from "@/app/actions/tripActions";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const id = (await params).id;
  const currentTrip = await getTripById(id, session?.user?.id as string);
  //fetch the images of the current trip

  return (
    <div className="mx-auto max-w-[1280px]">
      {currentTrip && currentTrip[0].startDate && currentTrip[0].endDate && (
        <div>
          <h1>{currentTrip[0].title}</h1>
          <p>{currentTrip[0].description}</p>
          <p>{format(currentTrip[0].startDate, "PPP", { locale: fr })}</p>
          <p>{format(currentTrip[0].endDate, "PPP", { locale: fr })}</p>
        </div>
      )}
    </div>
  );
}

export default page;
