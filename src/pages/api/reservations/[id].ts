import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma"
import { Reservation } from '@prisma/client';
 
export async function GET(
	req: NextApiRequest,
	res: NextApiResponse<Reservation>
) {
	const id = req.query.id as string;
	const result = await prisma.reservation.findUnique({where: {id}})
	res.status(200).json(result as Reservation);
}

export async function PUT(
	req: NextApiRequest,
	res: NextApiResponse<Reservation>
) {
	const id = req.query.id as string;
	const {date, storeId, item} = req.body;
	const result = await prisma.reservation.update({data:{date, storeId, item}, where: {id}})
	res.status(200).json(result);
}


export async function DELETE(
	req: NextApiRequest,
	res: NextApiResponse<Reservation>
) {
	const id = req.query.id as string;
	const result = await prisma.reservation.delete({where:{id}});
	res.status(200).json(result);
}