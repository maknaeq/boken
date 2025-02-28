"use server";

import { db } from "@/db/drizzle";
import { favorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getFavorites(userId: string) {
  try {
    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId));
    return userFavorites;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return [];
  }
}

export async function addFavorite(userId: string, tripId: string) {
  try {
    await db.insert(favorites).values({
      userId,
      tripId,
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    return {
      success: false,
      error: "Impossible d'ajouter aux favoris",
    };
  }
}

export async function removeFavorite(userId: string, tripId: string) {
  try {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.tripId, tripId)));
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression des favoris:", error);
    return {
      success: false,
      error: "Impossible de supprimer des favoris",
    };
  }
}
