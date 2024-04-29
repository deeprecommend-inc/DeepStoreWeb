import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

async function POST(req: NextApiRequest, res: NextApiResponse) {
	// Authrozation: Bearer <token>
	const token = req.headers.authorization?.substring(7);
	await prisma.$queryRaw`SELECT "User"."name" FROM "Session" INNER JOIN "User" ON "Session"."userId" = "User"."id" WHERE "Session"."id" = ${token}`
		.then(e => {
			if ((e as any[]).length == 1)
				res.status(200).json((e as any)[0]);
			else
				res.status(500).json({ msg: "no user found" });
		})
		.catch(e => res.status(500).json({ msg: e.toString() }));
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}