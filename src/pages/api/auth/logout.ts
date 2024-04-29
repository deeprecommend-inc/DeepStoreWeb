
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function POST(req: NextApiRequest, res: NextApiResponse) {
	// Authrozation: Bearer <token>
	const token = req.headers.authorization?.substring(7);
	await prisma.session.delete({where:{id:token}});
	res.status(200).json({msg: "success!"});
}	

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}