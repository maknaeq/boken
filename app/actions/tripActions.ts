"use server";
import { db } from "@/db/drizzle";
import { trips, tripStages } from "@/db/schema";
import {
  createTripFormSchema,
  createTripStageFormSchema,
  updateTripFormSchema,
} from "@/lib/type";
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

export async function deleteTrip(tripId: string, userId: string) {
  try {
    await db
      .delete(trips)
      .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));

    return {
      success: true,
      message: "Trip deleted successfully",
    };
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression du voyage", error);
    return {
      success: false,
      error: "Failed to delete trip",
    };
  }
}

export async function updateTrip(
  tripId: string,
  formData: z.infer<typeof updateTripFormSchema>,
) {
  try {
    const title = formData.title;
    const description = formData.description;
    const startDate = formData.startDate;
    const endDate = formData.endDate;
    const price = formData.price;
    const category = formData.category;

    if (!title || !description || !startDate || !endDate) {
      throw new Error("Tous les champs sont obligatoires !");
    }

    await db
      .update(trips)
      .set({
        title,
        description,
        price,
        category,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      .where(eq(trips.id, tripId));

    // Retourner un objet simple au lieu du résultat de la requête
    return {
      success: true,
      data: {
        id: tripId,
        title,
        description,
        price,
        category,
        startDate,
        endDate,
      },
    };
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour du voyage", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour du voyage",
    };
  }
}
export type CreateTripStageResponse = {
  success: boolean;
  stageId?: string;
  error?: string;
};

export async function createTripStage(
  formData: z.infer<typeof createTripStageFormSchema>,
  tripId: string,
  userId: string,
): Promise<CreateTripStageResponse> {
  try {
    // Validation des données avec Zod
    const validatedData = createTripStageFormSchema.parse(formData);

    // Vérification que le voyage appartient bien à l'utilisateur
    const [trip] = await db
      .select()
      .from(trips)
      .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));

    if (!trip) {
      return {
        success: false,
        error: "Voyage non trouvé ou accès non autorisé",
      };
    }

    // Création de l'étape
    const [newStage] = await db
      .insert(tripStages)
      .values({
        tripId,
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      })
      .returning({
        id: tripStages.id,
      });

    return {
      success: true,
      stageId: newStage.id,
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'étape :", error);

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
      error: "Une erreur est survenue lors de la création de l'étape",
    };
  }
}

// Action pour récupérer toutes les étapes d'un voyage
export async function getTripStages(tripId: string) {
  try {
    const stages = await db
      .select()
      .from(tripStages)
      .where(eq(tripStages.tripId, tripId))
      .orderBy(tripStages.createdAt);

    return stages;
  } catch (error) {
    console.error("Erreur lors de la récupération des étapes :", error);
    throw error;
  }
}
