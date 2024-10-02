import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import dbConnect from '@/src/lib/dbConnect';
import User from '@/src/dataBase/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          if (!credentials.email || !credentials.password) {
            return null;
          }
          await dbConnect();

          const { email, password } = credentials;

          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }
          console.log('user', user);
          console.log('password', password);
          const isMatch = await compare(password, user.password);
          if (!isMatch) {
            return null;
          }

          return {
            id: user._id,
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
