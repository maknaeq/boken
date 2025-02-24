"use server";
import { db } from "@/db/drizzle";
import { photos } from "@/db/schema";
import { supabase } from "@/supabase/client";
import { eq } from "drizzle-orm";

export async function createPhoto(data: {
  userId: string;
  tripId: string;
  stageId: string;
  placeId: string;
  url: string;
}) {
  try {
    const newPhoto = await db
      .insert(photos)
      .values({
        userId: data.userId,
        tripId: data.tripId,
        stageId: data.stageId,
        placeId: data.placeId,
        url: data.url,
      })
      .returning();
    return { success: true, photo: newPhoto[0] };
  } catch (error) {
    console.error("Error creating photo:", error);
    return { success: false, error: "Failed to create photo" };
  }
}

export async function deletePhoto(photoId: string, photoUrl: string) {
  try {
    // 1. Extraire le nom du fichier de l'URL
    const filePathMatch = photoUrl.match(/photo\/.+$/);
    if (!filePathMatch) {
      throw new Error("Invalid file path");
    }
    const filePath = filePathMatch[0];

    // 2. Supprimer le fichier du bucket Supabase
    const { error: storageError } = await supabase.storage
      .from("boken_medias")
      .remove([filePath]);

    if (storageError) {
      throw storageError;
    }

    // 3. Supprimer l'enregistrement de la base de données
    await db.delete(photos).where(eq(photos.id, photoId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting photo:", error);
    return { success: false, error: "Failed to delete photo" };
  }
}
