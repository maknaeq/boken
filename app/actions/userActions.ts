"use server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUserByEmail(email: string) {
  try {
    const req = await db.select().from(users).where(eq(users.email, email));
    return req;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération de l'utilisateur", error);
  }
}
