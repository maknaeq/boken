"use server";
import { db } from "@/db/drizzle";
import { trips } from "@/db/schema";
import { createTripFormSchema } from "@/lib/type";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export async function createTrip(
  formData: z.infer<typeof createTripFormSchema>,
  userId: string,
) {
  try {
    // Récupération des données du formulaire
    const title = formData.title;
    const description = formData.description;
    const startDate = formData.startDate;
    const endDate = formData.endDate;
    const price = formData.price;
    const category = formData.category;

    // ID utilisateur hardcodé (Clerk ou autre système d'auth)

    // Validation des données (éviter les erreurs)
    if (!title || !description || !startDate || !endDate) {
      throw new Error("Tous les champs sont obligatoires !");
    }

    // Insertion dans la base de données
    const newTrip = await db
      .insert(trips)
      .values({
        userId, // Assure-toi que la colonne `userId` est bien définie en BDD
        title,
        description,
        price: parseInt(price),
        category,
        startDate: new Date(startDate), // Convertir en Date (évite erreurs SQL)
        endDate: new Date(endDate),
      })
      .returning({ id: trips.id });
    return { success: true, tripId: newTrip[0].id };
  } catch (error: unknown) {
    console.error("Erreur lors de la création du voyage", error);
  }
}

export async function getAllUserTripsInfos(userId: string) {
  try {
    const req = await db
      .selectDistinct()
      .from(trips)
      .where(eq(trips.userId, userId));

    return req;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des voyages", error);
  }
}

export async function getTripById(tripId: string, userId: string) {
  try {
    const req = await db
      .selectDistinct()
      .from(trips)
      .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));

    return req;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération du voyage", error);
  }
}
