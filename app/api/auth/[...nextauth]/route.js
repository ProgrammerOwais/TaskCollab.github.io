import { connectToDB } from "@/utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/modals/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 4000,
      },
    }),
  ],
  callbacks: {
    // check every time the current user
    async session({ session }) {
      const userSession = await User.findOne({ email: session.user.email });
      // store the user id in session from mongodb
      session.user.id = userSession._id.toString();
      return session;
    },
    // sign in the user
    async signIn({ profile }) {
      try {
        await connectToDB();
        // if user is already sign in
        const existedUser = await User.findOne({ email: profile.email });
        // if not create a new user & save document in mongodb
        if (!existedUser) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.log("the error while singing in: ", error.message);
        return false;
      }
    },
  },
});
export { handler as GET, handler as POST };
