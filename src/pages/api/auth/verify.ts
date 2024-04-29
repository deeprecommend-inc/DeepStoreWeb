import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"

async function POST(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {token} = req.body;
	const verification = await prisma.emailVerification.findUnique({where:{id: token}});
	await prisma.user.update({where:{id: verification?.userId}, data:{is_verified: true, verification: {delete: true}}});
	if (!verification) {
		res.status(500).json({msg: "リンクが不正です"});
	} else {
		res.status(200).json({msg: "認証に成功しました"});
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}