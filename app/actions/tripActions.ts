"use server";
import { db } from "@/db/drizzle";
import { favorites, trips, tripStages } from "@/db/schema";
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
    const {
      title,
      description,
      dateRange,
      price,
      category,
      image: imageCover,
    } = formData;
    const startDate = dateRange.from;
    const endDate = dateRange.to;

    // Validation des données - sans vérifier description
    if (!title || !startDate || !endDate) {
      return {
        success: false,
        error: "Le titre et les dates sont obligatoires",
      };
    }

    // Insertion dans la base de données
    const newTrip = await db
      .insert(trips)
      .values({
        userId,
        title,
        description: description || "", // Utiliser une chaîne vide si pas de description
        price: parseInt(price),
        category,
        imageCover,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      .returning({ id: trips.id });

    return { success: true, tripId: newTrip[0].id };
  } catch (error: unknown) {
    console.error("Erreur lors de la création du voyage", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du voyage",
    };
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
    // Récupération du voyage sans vérification du propriétaire
    const trip = await db
      .selectDistinct()
      .from(trips)
      .where(eq(trips.id, tripId));

    if (trip.length === 0) {
      return null;
    }

    // Ajout d'une propriété pour indiquer si l'utilisateur est propriétaire
    return trip.map((t) => ({
      ...t,
      isOwner: t.userId === userId,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération du voyage", error);
    return null;
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

export async function deleteStageById(stageId: string) {
  try {
    await db.delete(tripStages).where(eq(tripStages.id, stageId));
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'étape:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression de l'étape",
    };
  }
}

export async function updateStageById(
  stageId: string,
  data: { title: string; description: string; location: string },
) {
  try {
    await db
      .update(tripStages)
      .set({
        title: data.title,
        description: data.description,
        location: data.location,
      })
      .where(eq(tripStages.id, stageId));
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étape:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour de l'étape",
    };
  }
}

export async function getFavoriteUserTrips(userId: string) {
  try {
    const userFavorites = await db
      .select({
        trip: trips,
        favorite: favorites,
      })
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .leftJoin(trips, eq(favorites.tripId, trips.id));

    return userFavorites.map(({ trip }) => ({
      ...trip,
    }));
  } catch (error) {
    console.error("Error getting favorite trips:", error);
    throw error;
  }
}
