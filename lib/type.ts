import { z } from "zod";

export const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message: "Le prénom doit contenir au moins 2 caractères",
      })
      .max(50, {
        message: "Le prénom doit contenir au plus 50 caractères",
      }),
    lastName: z
      .string()
      .min(2, {
        message: "Le nom doit contenir au moins 2 caractères",
      })
      .max(50, {
        message: "Le nom doit contenir au plus 50 caractères",
      }),
    email: z
      .string()
      .email({
        message: "L'email doit être valide",
      })
      .min(2, {
        message: "L'email doit contenir au moins 2 caractères",
      })
      .max(50, {
        message: "L'email doit contenir au plus 50 caractères",
      }),
    password: z
      .string()
      .min(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères",
      })
      .max(50, {
        message: "Le mot de passe doit contenir au plus 50 caractères",
      }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères",
      })
      .max(50, {
        message: "Le mot de passe doit contenir au plus 50 caractères",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
