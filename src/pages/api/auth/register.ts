import { sendVerificationLink } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

async function POST(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {name, email, password} = req.body as any as {name: string, email: string, password: string};
	const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    
	await prisma.emailVerification.create({ data: { expired_at: new Date(), user: { create: { name, email, password: passwordHash } } } })
		.then(async verification => 
			sendVerificationLink(await prisma.user.findUnique({where:{id:verification.userId}}) as User, verification)
		).then(e => res.status(200).json({msg: "success!"}))
		.catch(e => res.status(500).json({msg: e.toString() }));
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}