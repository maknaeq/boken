import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CreatePlace from "@/components/create-place";
import { getPlacesByStageId } from "@/app/actions/placeActions";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/type";
import RatingServerComponentWrapper from "./rating-server-component-wrapper";
import PlaceActions from "@/components/place-actions";
import { Badge } from "@/components/ui/badge";

type Stage = {
  id: string;
  tripId: string | null;
  title: string;
  description: string | null;
  location: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
};

async function StageAccordion({
  stage,
  index,
  user,
}: {
  stage: Stage;
  index: number;
  user: User;
}) {
  const places = await getPlacesByStageId(stage.id);
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`item-${index + 1}`}>
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="w-4">{index + 1}.</span>
            <h4 className="text-lg">{stage.title}</h4>
            <span className="text-gray-500">({stage.location})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <p>{stage.description}</p>
          <CreatePlace user={user} stageId={stage.id} />
          <div className="space-y-10 py-6">
            {places.length > 0 && (
              <h4 className="text-lg font-semibold">Lieux</h4>
            )}
            {places.map((place) => (
              <div key={place.id} className="flex items-start justify-between">
                <div className="space-y-2">
                  <RatingServerComponentWrapper
                    placeId={place.id}
                    userId={user?.[0].id as string}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-md">{place.name}</h5>
                      <Badge>{place.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{place.description}</p>
                  </div>
                </div>
                <div>
                  <Button size="icon" variant="ghost">
                    <ImagePlus />
                  </Button>
                  <PlaceActions place={place} />
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default StageAccordion;
