"use server";
import { db } from "@/db/drizzle";
import { trips } from "@/db/schema";

export async function createTrip(formData: FormData) {
  try {
    // Récupération des données du formulaire
    const tripName = formData.get("tripName") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    // ID utilisateur hardcodé (Clerk ou autre système d'auth)
    const userId = "527b0fe4-3242-412d-9ee5-4fac35450d10"; // UUID valide

    // Validation des données (éviter les erreurs)
    if (!tripName || !description || !startDate || !endDate) {
      throw new Error("Tous les champs sont obligatoires !");
    }

    // Insertion dans la base de données
    await db.insert(trips).values({
      userId, // Assure-toi que la colonne `userId` est bien définie en BDD
      title: tripName,
      description: description,
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
