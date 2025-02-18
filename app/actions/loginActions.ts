"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { signIn } from "@/lib/auth";
import { schema } from "@/lib/schema";
import { Credentials } from "@/lib/type";
import { redirect } from "next/navigation";
import { z } from "zod";

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

export async function signUp(data: z.infer<typeof schema>) {
  const validatedData = schema.parse(data);

  await db.insert(users).values({
    firstName: validatedData.firstName.toLowerCase(),
    lastName: validatedData.lastName.toLowerCase(),
    email: validatedData.email.toLowerCase(),
    password: validatedData.password,
  });

  redirect("/login");
}
