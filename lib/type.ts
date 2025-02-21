import { z } from "zod";
import { LinkProps } from "next/link";

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

export const createTripFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Le titre doit contenir au moins 2 caractères",
    })
    .max(50, {
      message: "Le titre doit contenir au plus 50 caractères",
    }),
  description: z.string().max(500, {
    message: "La description doit contenir au plus 500 caractères",
  }),
  startDate: z.date(),
  endDate: z.date(),
  price: z.string().regex(/^\d+$/, {
    message: "Le prix doit être un nombre",
  }),
  category: z.enum([
    "Backpacking",
    "Luxe",
    "Roadtrip",
    "Digital Nomad",
    "Normal",
  ]),
  image: z.string().url(),
});

export type User = {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  emailVerified: Date | null;
  image: string | null;
}[];

export type Credentials = {
  email: string;
  password: string;
};

export type RedirectButtonType = {
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "bento"
    | null
    | undefined;
  href: LinkProps["href"];
  children?: React.ReactNode;
};

export type NavItemType = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

export type TripCategory =
  | "Backpacking"
  | "Luxe"
  | "Roadtrip"
  | "Digital Nomad"
  | "Normal";
