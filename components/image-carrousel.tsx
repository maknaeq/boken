"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceWithPhotos } from "@/lib/type";
import { useRouter } from "next/navigation";
import { deletePhoto } from "@/app/actions/photoActions";
import { motion, AnimatePresence } from "framer-motion";

function ImageCarrousel({ place }: { place: PlaceWithPhotos }) {
  const [canScroll, setCanScroll] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const router = useRouter();

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

  const handleDeleteImage = async (photoId: string, photoUrl: string) => {
    setDeletingPhotoId(photoId);
    try {
      const result = await deletePhoto(photoId, photoUrl);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to delete photo");
        setDeletingPhotoId(null);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      setDeletingPhotoId(null);
    }
  };

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

  if (place.photos.length === 0) {
    return null;
  }

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
          <AnimatePresence>
            {place.photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: deletingPhotoId === photo.id ? 0 : 1,
                  scale: deletingPhotoId === photo.id ? 0.7 : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative h-20 w-28 flex-none rounded-lg bg-gray-200"
              >
                <Image
                  src={photo.url}
                  alt={photo.url}
                  width={112}
                  height={80}
                  className="h-full w-full rounded-lg object-cover"
                />
                <button
                  onClick={() => handleDeleteImage(photo.id, photo.url)}
                  className="absolute right-0.5 top-0.5 rounded-lg bg-gray-500/50 p-1 text-background"
                  disabled={deletingPhotoId === photo.id}
                >
                  <X size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
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
