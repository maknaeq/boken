import { number, z } from "zod";
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

export const updateTripFormSchema = z.object({
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
  price: number().int().positive(),
  category: z.enum([
    "Backpacking",
    "Luxe",
    "Roadtrip",
    "Digital Nomad",
    "Normal",
  ]),
});
export const createTripFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string(),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  price: z.string(),
  category: z.enum([
    "Backpacking",
    "Luxe",
    "Roadtrip",
    "Digital Nomad",
    "Normal",
  ]),
  image: z.string().min(1, "Une image est requise"),
});

export const createTripStageFormSchema = z.object({
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
  location: z.string().min(2, {
    message: "La localisation doit contenir au moins 2 caractères",
  }),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
});

export type User =
  | {
      id: string;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      password: string | null;
      emailVerified: Date | null;
      image: string | null;
    }[]
  | undefined;

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

export const createPlaceFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  category: z.enum([
    "Restaurant",
    "Musée",
    "Parc",
    "Monument",
    "Shopping",
    "Autre",
  ]),
  location: z.string().min(1, "La localisation est requise"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type Place = z.infer<typeof createPlaceFormSchema>;

export interface PhotoData {
  id: string;
  url: string;
  placeId: string;
  createdAt: Date;
}

export interface PlaceWithPhotos {
  id: string;
  stageId: string | null;
  name: string;
  description: string | null;
  category: string | null;
  location: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  photos: PhotoData[];
}

export interface QueryResult {
  id: string;
  stageId: string | null;
  name: string;
  description: string | null;
  category: string | null;
  location: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  photoId: string | null;
  photoUrl: string | null;
  photoCreatedAt: Date | null;
}
