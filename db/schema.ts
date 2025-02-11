import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

// Table des utilisateurs
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash"), // Si tu gères un login par email/password
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des voyages
export const trips = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des étapes du voyage
export const tripStages = pgTable("trip_stages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(), // Ex: "Bangkok, Thaïlande"
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des lieux visités dans une étape
export const places = pgTable("places", {
  id: uuid("id").primaryKey().defaultRandom(),
  stageId: uuid("stage_id").references(() => tripStages.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // Ex: "Restaurant", "Musée", "Parc"
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des avis / notes sur un lieu
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  placeId: uuid("place_id").references(() => places.id, {
    onDelete: "cascade",
  }),
  rating: integer("rating").notNull().default(3), // Note de 1 à 5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table des photos associées aux voyages, étapes et lieux
export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  tripId: uuid("trip_id").references(() => trips.id, { onDelete: "cascade" }), // Peut être NULL
  stageId: uuid("stage_id").references(() => tripStages.id, {
    onDelete: "cascade",
  }), // Peut être NULL
  placeId: uuid("place_id").references(() => places.id, {
    onDelete: "cascade",
  }), // Peut être NULL
  url: text("url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
