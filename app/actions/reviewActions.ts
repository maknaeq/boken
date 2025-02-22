"use server";
import { db } from "@/db/drizzle";
import { reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createRatingPlaceById(
  userId: string,
  placeId: string,
  rating: number,
) {
  try {
    const req = await db.insert(reviews).values({
      userId,
      placeId,
      rating,
    });
    return {
      success: true,
      req,
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'avis :", error);
  }
}

export async function updateRatingPlaceById(
  userId: string,
  placeId: string,
  rating: number,
) {
  try {
    await db
      .update(reviews)
      .set({ rating })
      .where(and(eq(reviews.userId, userId), eq(reviews.placeId, placeId)));

    return {
      success: true,
      rating, // Ne retourner que les données nécessaires
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avis :", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour de la note",
    };
  }
}

export async function getRatingPlaceById(placeId: string) {
  try {
    const req = await db
      .select()
      .from(reviews)
      .where(eq(reviews.placeId, placeId));
    return {
      success: true,
      req: req[0]?.rating ?? 0,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'avis :", error);
  }
}
