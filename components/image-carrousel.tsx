"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PlaceProps = {
  place: {
    id: string;
    stageId: string;
    name: string;
    category: string;
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    photos: {
      id: string;
      placeId: string;
      url: string;
    }[];
    createdAt: Date;
  };
};

function ImageCarrousel({ place }: PlaceProps) {
  console.log("place", place);
  const [canScroll, setCanScroll] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScroll = useCallback(() => {
    const container = document.getElementById(`photos-${place.id}`);
    if (container) {
      const hasScroll = container.scrollWidth > container.offsetWidth;
      setCanScroll(hasScroll);

      // Vérifier si on est au début ou à la fin
      const atStart = container.scrollLeft <= 0;
      const atEnd =
        container.scrollLeft + container.offsetWidth >=
        container.scrollWidth - 1;

      setIsAtStart(atStart);
      setIsAtEnd(atEnd);

      // Mise à jour initiale des gradients
      setShowLeftGradient(hasScroll && !atStart);
      setShowRightGradient(hasScroll && !atEnd);
    }
  }, [place.id]);

  const handleScroll = useCallback((e: Event) => {
    const container = e.target as HTMLDivElement;
    const atStart = container.scrollLeft <= 0;
    const atEnd =
      container.scrollLeft + container.offsetWidth >= container.scrollWidth - 1; // -1 pour gérer les arrondis

    // Mise à jour des états
    setIsAtStart(atStart);
    setIsAtEnd(atEnd);
    setShowLeftGradient(!atStart);
    setShowRightGradient(!atEnd);
  }, []);

  useEffect(() => {
    const container = document.getElementById(`photos-${place.id}`);
    if (container) {
      container.addEventListener("scroll", handleScroll);

      // Vérification initiale
      checkScroll();
    }

    const timer = setTimeout(checkScroll, 100); // Délai légèrement plus long pour s'assurer que le DOM est complètement chargé
    window.addEventListener("resize", checkScroll);

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, handleScroll, place.id]);

  return (
    <div className="relative h-32">
      <h5 className="mb-2">Photos</h5>
      <div className="flex items-center">
        {/* Gradient gauche */}
        {showLeftGradient && (
          <div className="pointer-events-none absolute left-0 z-10 h-20 w-24 bg-gradient-to-r from-background to-transparent" />
        )}

        {/* Bouton gauche - visible seulement si on peut défiler ET qu'on n'est pas au début */}
        {canScroll && !isAtStart && (
          <Button
            className="absolute left-0 z-20 transition-colors"
            variant={"ghost"}
            size="icon"
            onClick={() => {
              const container = document.getElementById(`photos-${place.id}`);
              if (container) {
                container.scrollLeft -= 200;
              }
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          id={`photos-${place.id}`}
          className={cn(
            "no-scrollbar flex gap-2 overflow-x-auto scroll-smooth",
          )}
        >
          {place.photos.map((_, i) => (
            <div key={i} className="h-20 w-28 flex-none rounded-lg bg-gray-200">
              <Image
                src={place.photos[i].url}
                alt={place.photos[i].url}
                width={112}
                height={80}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>

        {/* Gradient droit */}
        {showRightGradient && (
          <div className="pointer-events-none absolute right-0 z-10 h-20 w-24 bg-gradient-to-l from-background to-transparent" />
        )}

        {/* Bouton droit - visible seulement si on peut défiler ET qu'on n'est pas à la fin */}
        {canScroll && !isAtEnd && (
          <Button
            className="absolute right-0 z-20 transition-colors"
            variant={"ghost"}
            size="icon"
            onClick={() => {
              const container = document.getElementById(`photos-${place.id}`);
              if (container) {
                container.scrollLeft += 200;
              }
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ImageCarrousel;
