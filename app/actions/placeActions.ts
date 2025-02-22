// app/_actions/places.ts
"use server";

import { db } from "@/db/drizzle";
import { places, tripStages } from "@/db/schema";
import { createPlaceFormSchema } from "@/lib/type";
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

export async function getPlacesByStageId(stageId: string) {
  return db.select().from(places).where(eq(places.stageId, stageId));
}
