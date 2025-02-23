"use client";

import React, { useState } from "react";
import { createApi } from "unsplash-js";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle, Search } from "lucide-react";
import Image from "next/image";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
});

interface UnsplashImagePickerProps {
  onImageSelect: (imageUrl: string) => void;
}

export function UnsplashImagePicker({
  onImageSelect,
}: UnsplashImagePickerProps) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const searchPhotos = async () => {
    setLoading(true);
    try {
      const result = await unsplash.search.getPhotos({
        query,
        page: 1,
        perPage: 8,
        orientation: "landscape",
      });
      setImages(result.response?.results || []);
    } catch (error) {
      console.error("Erreur lors de la recherche d'images:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Rechercher une image..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchPhotos()}
        />
        <Button onClick={searchPhotos} disabled={loading}>
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
            onClick={() => onImageSelect(image.urls.regular)}
          >
            <Image
              src={image.urls.small}
              alt={image.alt_description || ""}
              className="object-cover transition-transform hover:scale-110"
              fill
            />
          </div>
        ))}
      </div>
    </div>
  );
}
