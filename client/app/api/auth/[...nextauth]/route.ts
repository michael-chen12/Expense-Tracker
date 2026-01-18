import NextAuth, { Account, Profile, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

// Helper to generate JWT for credentials login
function generateAccessToken(userId: string, email: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not configured');
  }
  return jwt.sign(
    { sub: userId, userId, email },
    secret,
    { expiresIn: '7d' }
  );
}

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Call backend to validate credentials
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Invalid credentials');
          }

          const data = await response.json();

          // Return user object
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          };
        } catch (error: any) {
          console.error('Authorization error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      // Only sync GitHub users (credentials users are already in the database)
      if (account?.provider === 'github') {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/users/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              githubId: account?.providerAccountId,
              name: user.name,
            }),
          });

          if (!response.ok) {
            console.error('Failed to sync user to database');
            // Continue anyway - we'll create user later if needed
          }
        } catch (error) {
          console.error('Error syncing user:', error);
          // Continue anyway
        }
      }

      return true;
    },

    async jwt({ token, user, account }: {
      token: JWT;
      user?: User;
      account?: Account | null;
    }) {
      // Add userId and accessToken to the JWT
      if (user) {
        console.log('[JWT] Adding user info:', { userId: user.id, email: user.email });
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        
        // Generate access token for credentials provider (account will be null)
        if (!account) {
          console.log('[JWT] Generating access token for credentials user (no account)');
          token.accessToken = generateAccessToken(user.id!, user.email!);
        }
      }

      // For OAuth providers, use the provider's access_token
      if (account?.access_token) {
        console.log('[JWT] Using OAuth access token');
        token.accessToken = account.access_token;
      }

      // Ensure users always have an access token on subsequent requests
      if (!token.accessToken && token.userId && token.email) {
        console.log('[JWT] Generating access token on refresh');
        token.accessToken = generateAccessToken(token.userId as string, token.email as string);
      }

      console.log('[JWT] Final token:', { userId: token.userId, hasAccessToken: !!token.accessToken });
      return token;
    },

    async session({ session, token }: {
      session: Session;
      token: JWT;
    }) {
      // Add userId and accessToken to the session
      if (session.user) {
        (session.user as any).id = token.userId || token.sub;
        (session as any).accessToken = token.accessToken;
        (session as any).userId = token.userId || token.sub;
        console.log('[SESSION] Session updated:', { 
          userId: (session as any).userId, 
          hasAccessToken: !!token.accessToken 
        });
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
