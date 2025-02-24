"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { supabase } from "@/supabase/client";
import { Loader2, X } from "lucide-react";
import { createPhoto } from "@/app/actions/photoActions";
import { useRouter } from "next/navigation";
interface UploadFileProps {
  userId: string;
  tripId: string;
  stageId: string;
  placeId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UploadFile({
  userId,
  tripId,
  stageId,
  placeId,
  setIsOpen,
}: UploadFileProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls((prev) => [...prev, ...newImageUrls]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClickUploadImagesButton = async () => {
    if (imageUrls.length === 0) return;

    setUploading(true);

    for (const url of imageUrls) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = `photo/image-${Date.now()}.jpg`;

        const { error } = await supabase.storage
          .from("boken_medias")
          .upload(fileName, blob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from("boken_medias")
          .getPublicUrl(fileName);

        if (publicUrlData.publicUrl) {
          const result = await createPhoto({
            userId,
            tripId,
            stageId,
            placeId,
            url: publicUrlData.publicUrl,
          });

          if (!result.success) {
            throw new Error("Failed to save photo to database");
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
      } finally {
        setIsOpen(false);
        router.refresh();
      }
    }

    setImageUrls([]);
    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        hidden
        multiple
        ref={imageInputRef}
        onChange={handleImageChange}
      />
      <Button
        onClick={() => imageInputRef.current?.click()}
        className="w-full border-dashed"
        variant={"outline"}
      >
        Selectionnez une/des image(s)
      </Button>

      <div className="mt-4 flex flex-wrap gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <Image
              src={url}
              alt={`image-${index}`}
              width={128}
              height={128}
              className="h-32 w-32 rounded-md object-cover"
            />
            <Button
              size="icon"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-primary/50"
              onClick={() => removeImage(index)}
            >
              <X size={12} />
            </Button>
          </div>
        ))}
      </div>

      <Button
        onClick={handleClickUploadImagesButton}
        disabled={uploading}
        className="mt-4 w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" />
            Publier
          </>
        ) : (
          "Publier"
        )}
      </Button>
    </div>
  );
}

export default UploadFile;
