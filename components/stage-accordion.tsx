import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CreatePlace from "@/components/create-place";
import { getPlacesByStageId } from "@/app/actions/placeActions";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/type";
import RatingServerComponentWrapper from "./rating-server-component-wrapper";
import PlaceActions from "@/components/place-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import StageActions from "@/components/stage-actions";
import ImageCarrousel from "./image-carrousel";
import AddingImageButton from "./adding-image-button";

export type Stage = {
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
  isOwner,
}: {
  stage: Stage;
  index: number;
  user: User;
  isOwner: boolean;
}) {
  const places = await getPlacesByStageId(stage.id);
  return (
    <div className="flex w-full items-center gap-4">
      <Accordion type="single" collapsible className="w-full">
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
            <div className="space-y-10 py-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-0">
                <h4 className="text-lg font-semibold">Activités</h4>
                {isOwner && <CreatePlace user={user} stageId={stage.id} />}
              </div>
              {places.length === 0 ? (
                <p className="text-gray-500">Aucune activité pour le moment</p>
              ) : (
                places.map((place) => (
                  <div
                    key={place.id}
                    className="flex flex-col gap-4 rounded-xl border p-4 shadow-sm"
                  >
                    <div>
                      <div className="space-y-5">
                        <div className="w-full items-center justify-between md:flex">
                          <div className="flex items-center gap-2">
                            <h5 className="text-lg font-semibold">
                              {place.name}
                            </h5>
                            <Badge>{place.category}</Badge>
                          </div>
                          <div className="p-1">
                            ``
                            {isOwner && (
                              <AddingImageButton
                                userId={user?.[0].id as string}
                                tripId={stage.tripId as string}
                                stageId={stage.id}
                                placeId={place.id}
                              />
                            )}
                            <Link
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="icon" variant="ghost">
                                <MapPin />
                              </Button>
                            </Link>
                            {isOwner && <PlaceActions place={place} />}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <RatingServerComponentWrapper
                            placeId={place.id}
                            userId={user?.[0].id as string}
                          />

                          <div>
                            <p className="text-sm">{place.location}</p>
                            <p className="text-sm text-gray-500">
                              {place.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ImageCarrousel place={place} />
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {isOwner && <StageActions stage={stage} />}
    </div>
  );
}

export default StageAccordion;
