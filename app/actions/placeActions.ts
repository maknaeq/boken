// app/_actions/places.ts
"use server";

import { db } from "@/db/drizzle";
import { photos, places, tripStages } from "@/db/schema";
import {
  createPlaceFormSchema,
  PlaceWithPhotos,
  QueryResult,
} from "@/lib/type";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createRatingPlaceById } from "@/app/actions/reviewActions";

export type CreatePlaceResponse = {
  success: boolean;
  placeId?: string;
  error?: string;
};

export async function createPlace(
  formData: z.infer<typeof createPlaceFormSchema>,
  stageId: string,
  userId?: string,
): Promise<CreatePlaceResponse> {
  try {
    const validatedData = createPlaceFormSchema.parse(formData);

    // Vérification que l'étape existe
    const [stage] = await db
      .select()
      .from(tripStages)
      .where(eq(tripStages.id, stageId));

    if (!stage) {
      return {
        success: false,
        error: "Étape non trouvée",
      };
    }

    // Création du lieu
    const [newPlace] = await db
      .insert(places)
      .values({
        stageId,
        name: validatedData.name,
        description: validatedData.description || null,
        category: validatedData.category,
        location: validatedData.location,
        latitude: validatedData.latitude || null,
        longitude: validatedData.longitude || null,
      })
      .returning({
        id: places.id,
      });

    if (userId) {
      await createRatingPlaceById(userId, newPlace.id, 0);
    }

    return {
      success: true,
      placeId: newPlace.id,
    };
  } catch (error) {
    console.error("Erreur lors de la création du lieu :", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Données de formulaire invalides : " +
          error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de la création du lieu",
    };
  }
}

export async function deletePlaceById(placeId: string) {
  try {
    await db.delete(places).where(eq(places.id, placeId));
    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du lieu :", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression du lieu",
    };
  }
}

export async function getPlacesByStageId(
  stageId: string,
): Promise<PlaceWithPhotos[]> {
  const results = await db
    .select({
      id: places.id,
      stageId: places.stageId,
      name: places.name,
      description: places.description,
      category: places.category,
      location: places.location,
      latitude: places.latitude,
      longitude: places.longitude,
      createdAt: places.createdAt,
      photoId: photos.id,
      photoUrl: photos.url,
      photoCreatedAt: photos.createdAt,
    })
    .from(places)
    .leftJoin(photos, eq(photos.placeId, places.id))
    .where(eq(places.stageId, stageId));

  const placesMap = new Map<string, PlaceWithPhotos>();

  (results as QueryResult[]).forEach((row) => {
    if (!placesMap.has(row.id)) {
      placesMap.set(row.id, {
        id: row.id,
        stageId: row.stageId,
        name: row.name,
        description: row.description,
        category: row.category,
        location: row.location,
        latitude: row.latitude,
        longitude: row.longitude,
        createdAt: row.createdAt,
        photos: [],
      });
    }

    if (row.photoId && row.photoUrl && row.photoCreatedAt) {
      const place = placesMap.get(row.id);
      if (place) {
        place.photos.push({
          id: row.photoId,
          url: row.photoUrl,
          placeId: row.id,
          createdAt: row.photoCreatedAt,
        });
      }
    }
  });

  return Array.from(placesMap.values());
}

export async function updatePlaceById(
  placeId: string,
  data: { name: string; description?: string; category: string },
) {
  try {
    await db
      .update(places)
      .set({
        name: data.name,
        description: data.description || null,
        category: data.category,
      })
      .where(eq(places.id, placeId));
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
