"use client";

import { useState } from "react";

export default function StarRating({ rating = 0 }) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div
      className="flex items-center space-x-1 px-1"
      onMouseLeave={() => setHoverRating(null)}
    >
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          onMouseEnter={() => setHoverRating(index + 1)}
          className={`cursor-pointer transition-all ease-out ${index < (hoverRating ?? rating) ? "grayscale-0" : "grayscale"} hover:-rotate-6 hover:scale-110 hover:grayscale-0`}
        >
          ⭐️
        </span>
      ))}
    </div>
  );
}
