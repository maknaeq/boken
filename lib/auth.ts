import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { loginSchema } from "@/lib/schema";
import { v4 as uuid } from "uuid";
import { encode } from "next-auth/jwt";
import bcrypt from "bcrypt";

const adapter = DrizzleAdapter(db);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  pages: {
    error: "/auth/error",
  },
  trustHost: true,
  providers: [
    Google,
    Github,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = loginSchema.parse(credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("L'email et le mot de passe sont requis");
        }

        const user = await db
          .selectDistinct()
          .from(users)
          .where(eq(users.email, validatedCredentials.email.toLowerCase()));

        if (user.length === 0) {
          return null;
        }

        const foundUser = user[0];

        const passwordMatch = await bcrypt.compare(
          validatedCredentials.password,
          foundUser.password as string,
        );

        if (!passwordMatch) {
          throw new Error("Informations d'identification incorrectes");
        }

        return {
          id: foundUser.id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          image: foundUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params?.token?.sub) {
          throw new Error(
            "Aucun identifiant utilisateur trouvé dans le jeton JWT",
          );
        }

        const createSession = await adapter?.createSession?.({
          sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createSession) {
          throw new Error("Impossible de créer une session");
        }

        return sessionToken;
      }
      return encode(params);
    },
  },
});
