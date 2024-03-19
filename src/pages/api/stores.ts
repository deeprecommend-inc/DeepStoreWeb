import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"
import { Store } from "@prisma/client";


async function GET(
	req: NextApiRequest,
	res: NextApiResponse<Store[]>
) {
	const stores = await prisma.store.findMany();
	res.status(200).json(stores);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") GET(req, res);
	else res.status(404)
}