"use client";
import React, { ChangeEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { supabase } from "@/supabase/client";

function UploadFile() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls((prev) => [...prev, ...newImageUrls]);
    }
  };

  const handleClickUploadImagesButton = async () => {
    if (imageUrls.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const url of imageUrls) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = `photo/image-${Date.now()}.jpg`; // 🔥 Ajout du dossier photo

        const { error } = await supabase.storage
          .from("boken_medias")
          .upload(fileName, blob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        // Récupération de l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from("boken_medias")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
      }
    }

    console.log("Images uploadées :", uploadedUrls);
    setImageUrls([]); // Efface les images locales après l'upload
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
      <Button onClick={() => imageInputRef.current?.click()}>
        Select images
      </Button>

      <div className="mt-4 flex gap-4">
        {imageUrls.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`image-${index}`}
            width={128}
            height={128}
            className="h-32 w-32 rounded-md object-cover"
          />
        ))}
      </div>

      <Button onClick={handleClickUploadImagesButton} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}

export default UploadFile;
