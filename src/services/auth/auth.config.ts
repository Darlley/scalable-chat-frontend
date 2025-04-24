import type { NextAuthConfig } from 'next-auth';
import Github from 'next-auth/providers/github';

export default {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  ],
} satisfies NextAuthConfig;