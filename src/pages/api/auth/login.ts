import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "@/lib/prisma";

async function POST(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email, password } = req.body as any as { email: string, password: string };
	const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

	try {
		const user = await prisma.user.findUniqueOrThrow({ where: { email, password: passwordHash } });
		await prisma.session.create({ data: { userId: user.id } })
			.then(e => res.status(200).json({ token: e.id }))
			.catch(e => res.status(500).json({ msg: e.toString() }));
	} catch (e: any) {
		// ユーザーが見つからなかった場合
		res.status(500).json({ msg: e.toString() });
	}
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}