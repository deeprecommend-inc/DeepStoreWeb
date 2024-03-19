import { NextApiRequest, NextApiResponse } from "next";
import prisma  from "@/lib/prisma";
import { sendPasswordResetLink } from "@/lib/mailer";
import { User } from "@prisma/client";

async function POST(req: NextApiRequest, res: NextApiResponse) {
	const {email} = req.body ;
	await prisma.passwordResetToken.create({data: {expired_at: new Date(), user: {connect:{email}}}})
		.then(async resetToken => 
			sendPasswordResetLink(await prisma.user.findUnique({where:{id:resetToken.userId}}) as User, resetToken.id)
		).then(e => res.status(200).json({msg: "success!"}))
		.catch(e => res.status(500).json({msg: e.toString() }));
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method=="POST") POST(req, res);
}