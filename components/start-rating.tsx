"use client";

import { useState } from "react";
import { updateRatingPlaceById } from "@/app/actions/reviewActions";

interface StarRatingProps {
  rating?: number;
  placeId: string;
  userId: string;
}

export default function StarRating({
  rating = 0,
  placeId,
  userId,
}: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRatingClick = async (newRating: number) => {
    try {
      const result = await updateRatingPlaceById(userId, placeId, newRating);
      if (result?.success) {
        setCurrentRating(newRating);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
    }
  };

  return (
    <div
      className="flex items-center space-x-1 px-1"
      onMouseLeave={() => setHoverRating(null)}
    >
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onClick={() => handleRatingClick(index + 1)}
          onMouseEnter={() => setHoverRating(index + 1)}
          className={`cursor-pointer transition-all ease-out ${
            index < (hoverRating ?? currentRating) ? "grayscale-0" : "grayscale"
          } hover:-rotate-6 hover:scale-110 hover:grayscale-0`}
        >
          ⭐️
        </span>
      ))}
    </div>
  );
}
