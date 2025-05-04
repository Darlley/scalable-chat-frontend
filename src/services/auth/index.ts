import NextAuth, { Account, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import { redirect } from "next/navigation";

export interface CustomSession {
  user?: CustomUser;
  expires: string;
}
export interface CustomUser {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
  token?: string | null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    })
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: "/",
    error: "/auth/error"
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email || !account) {
          throw new Error("Missing required user information");
        }

        const payload = {
          email: user.email,
          name: user.name || "GitHub User",
          oauth_id: account.providerAccountId,
          provider: account.provider,
          image: user.image,
        };

        const response = await fetch("http://localhost:9000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to authenticate");
        }

        const data = await response.json();
        
        // Store the token in the user object to be accessible in the session
        user.id = data.user.id.toString();
        user.token = data.token;
        user.provider = account.provider;
        
        return true;
      } catch (error: any) {
        console.error("Sign in error:", error);
        return redirect(
          `/auth/error?message=${encodeURIComponent(error.message || "Authentication failed")}`
        );
      }
    },

    async session({ session, token }) {
      session.user = token.user as CustomUser;
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});