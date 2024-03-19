import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

import crypto from "crypto";
import { Adapter } from 'next-auth/adapters';

const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
	session: { strategy: "jwt" },
	pages: { signIn: "/login" },
	// adapter: PrismaAdapter(prisma) as Adapter,
	secret: "this is secret",
	providers: [
    
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {label: "メールアドレス", type: "email", placeholder: "example@gmail.com"},
				password: { label: "パスワード", type: "password" }
			},
			async authorize(credentials, req) {
				const email = credentials?.email;
				const password = credentials?.password;
				const passwordHash = crypto.createHash("sha256").update(password || "").digest("hex");
				const user = await prisma.user.findUnique({where:{email, password: passwordHash, is_verified: true}});
				if (user) {
					return user
				} else {
					return null
				}
			}
		}),
	]
};
export default NextAuth(authOptions);