"use server";
import { db } from "@/db/drizzle";
import { trips } from "@/db/schema";
import { createTripFormSchema } from "@/lib/type";
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

    // ID utilisateur hardcodé (Clerk ou autre système d'auth)

    // Validation des données (éviter les erreurs)
    if (!title || !description || !startDate || !endDate) {
      throw new Error("Tous les champs sont obligatoires !");
    }

    // Insertion dans la base de données
    await db.insert(trips).values({
      userId, // Assure-toi que la colonne `userId` est bien définie en BDD
      title,
      description,
      startDate: new Date(startDate), // Convertir en Date (évite erreurs SQL)
      endDate: new Date(endDate),
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la création du voyage", error);
  }
}

export async function getAllTrips() {
  try {
    const req = await db.select().from(trips);
    return req;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des voyages", error);
  }
}
