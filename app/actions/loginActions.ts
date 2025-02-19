"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/schema";
import { Credentials } from "@/lib/type";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function loginWithGoogle() {
  try {
    await signIn("google");
  } catch (error) {
    console.error(error);
  }
}

export async function loginWithGithub() {
  try {
    await signIn("github");
  } catch (error) {
    console.error(error);
  }
}

export async function loginWithCredentials(values: Credentials) {
  try {
    const { email, password } = values;
    await signIn("credentials", { email, password });
  } catch (error) {
    console.error(error);
  }
}

export async function signUp(data: z.infer<typeof signupSchema>) {
  let error: string | null = null;
  let success: string | null = null;
  const validatedData = signupSchema.parse(data);

  // Vérifier si l'email existe déjà
  const isEmailAlreadyInUse = await db
    .select()
    .from(users)
    .where(eq(users.email, validatedData.email.toLowerCase()));

  if (isEmailAlreadyInUse.length > 0) {
    error = "L'email est déjà utilisé";
  } else {
    // Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      SALT_ROUNDS,
    );

    await db.insert(users).values({
      firstName: validatedData.firstName.toLowerCase(),
      lastName: validatedData.lastName.toLowerCase(),
      email: validatedData.email.toLowerCase(),
      password: hashedPassword, // Stocker le mot de passe haché
    });
    success = "Inscription réussie";
    redirect("/login");
  }
  return { error, success };
}
