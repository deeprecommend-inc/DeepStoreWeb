import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma"
import { Reservation } from '@prisma/client';
import { useSession } from 'next-auth/react';
 
async function GET(
	req: NextApiRequest,
	res: NextApiResponse<Reservation[]>
) {
	const result = await prisma.reservation.findMany();
	res.status(200).json(result);
}

async function POST(
	req: NextApiRequest,
	res: NextApiResponse<Reservation>
) {
	const {date, storeId, item} = req.body;
	const {data: session} = useSession();
	const user = await prisma.user.findUnique({where:{email:session?.user?.email||""}});
	if (!user) {
		res.status(500);
		return;
	}
	await prisma.reservation.create({data:{date, storeId, userId: user.id, item}})
		.then(result => res.status(200).json(result))
		.catch(err => res.status(500));
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method=="GET") GET(req, res);
	else if (req.method=="POST") POST(req, res);
	else {
		res.status(404);
	}
}