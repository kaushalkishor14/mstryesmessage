import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Session } from "inspector";

export const authOptions: NextAuthOptions = {
  providers: [
    // ye aapne aap ek method hai jo aapko object deta hai
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      // ab nextauth ko  nhi  pata authorize kaise kiya jaaye es liye krna hai
      async authorize(credentials: any): Promise<any> {
        // for acces krne liye
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.indentifier },
              { username: credentials.indentifier },
            ],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first befror login ");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Passwords");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
//     async session({ session, token }) {
//   if (token) {
//     session.user._id = token._id;
//     session.isVerified = token.isVerified;
//     session.isAcceptingMessages = token.isAcceptingMessages;
//     session.Username = token.Username; // Assuming token has a Username property
//   }
// }
//     return session;
  
//   },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username == user.username;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
