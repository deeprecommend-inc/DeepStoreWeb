import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"
import crypto from "crypto";

async function POST(req: NextApiRequest, res: NextApiResponse) {
	const {token, password} = req.body as {token: string, password: string};
	const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
	await prisma.passwordResetToken.findUniqueOrThrow({where: {id: token}})
		.then(res => res.userId)
		.then(userId => 
			prisma.user.update({
				data: {password: passwordHash},
				where: {id: userId}
			}))
		.then(e => res.status(200).json({msg: "success!"}))
		.catch(e => console.log(e));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method=="POST") POST(req, res);
}