import NextAuth, { Account } from "next-auth";
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

  debug: true,

  session: { strategy: 'jwt' },

  pages: {
    signIn: "/",
    error: "/auth/error"
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔍 signIn callback executado", { 
        userEmail: user?.email,
        accountProvider: account?.provider,
        accountId: account?.providerAccountId
      });
      
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

        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
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
      console.log("session")
      // if (session.user) {
      //   // Pass the ID from token to the session
      //   session.user.id = token.sub;
        
      //   // Pass the role from token to the session
      //   if (token.role) {
      //     session.user.role = token.role as UserRole;
      //   }
        
      //   // Pass the custom token from token to the session
      //   if (token.customToken) {
      //     session.user.token = token.customToken as string;
      //   }
      // }
      
      return session;
    },

    async jwt({ token, user }) {
      console.log("jwt")
      // First time jwt is called
      if (user) {
        token.sub = user.id;
        token.customToken = user.token;
      }

      // Subsequent calls
      if (!token.sub) return token;

      // try {
      //   const dbUser = await prisma.user.findUnique({
      //     where: { id: token.sub },
      //     select: { role: true },
      //   });

      //   if (dbUser) {
      //     token.role = dbUser.role;
      //   }
      // } catch (error) {
      //   console.error("Error fetching user role:", error);
      // }

      return token;
    }
  },
});