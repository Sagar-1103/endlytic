import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import GitlabProvider from "next-auth/providers/gitlab";
import CredentialsProvider from "next-auth/providers/credentials"
import { DefaultSession, DefaultUser, NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs"
import { importJWK, JWTPayload, SignJWT } from "jose";
import { cookies } from "next/headers";
import prismaClient from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
    jwtToken?: string;
  }

  interface User extends DefaultUser {
    id?: string;
    jwtToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    jwtToken?: string;
  }
}

const generateJWT = async (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET;

  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: "oct" });

  const jwt = await new SignJWT({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    jti: randomUUID(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('365d')
    .sign(jwk);
  return jwt;
}


export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID as string,
      clientSecret: process.env.GITLAB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials:", credentials);
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prismaClient.user.findUnique({
          where: { email: credentials.email },
        })
         

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }
        
        return { id: String(user.id), email: user.email }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false;
        const createdUser = await prismaClient.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            email: user.email,
            name: user.name ?? user.email.split("@")[0],
            image: user.image,
          }
        })
        const payload = { id: createdUser.id };
        const jwt = await generateJWT(payload);

        const cookieStore = await cookies();

        cookieStore.set('jwtToken', jwt, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        })
        user.jwtToken = jwt;
      } catch (error) {
        console.log(error);
      }
      return true;
    },
    async jwt({ token, user, account }) {
      const newToken: JWT = token;
      if (account && user) {
        newToken.accessToken = account.access_token;
        newToken.id = user.id;
        newToken.jwtToken = user.jwtToken || newToken.jwtToken;
      }
      return newToken;
    },
    async session({ session, token }) {
      const newSession: Session = session;
      if (token) {
        session.user.id = token.id;
        session.jwtToken = token.jwtToken;
      }
      return newSession;
    }
  }
} satisfies NextAuthOptions