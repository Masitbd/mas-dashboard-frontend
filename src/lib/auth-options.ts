import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }
        return {
          id: 'mock-user',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'editor'
        };
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || 'mock-user';
        session.user.role = (token.role as string) || 'editor';
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.role) {
        token.role = 'editor';
      }
      return token;
    }
  }
};
