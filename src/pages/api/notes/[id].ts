import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma"
import { Note } from '@prisma/client';
 
export async function GET(
	req: NextApiRequest,
	res: NextApiResponse<Note>
) {
	const id = req.query.id as string;
	const result = await prisma.note.findUnique({where:{id}}) as Note;
	res.status(200).json(result);
}

export async function PUT(
	req: NextApiRequest,
	res: NextApiResponse<Note>
) {
	const id = req.query.id as string;
	const [title, content] = req.body;
	const result = await prisma.note.update({data:{title, content}, where: {id}})
	res.status(200).json(result);
}

export async function DELETE(
	req: NextApiRequest,
	res: NextApiResponse<Note>
) {
	const id = req.query.id as string;
	const result = await prisma.note.delete({where: {id}});
	res.status(200).json(result);
}