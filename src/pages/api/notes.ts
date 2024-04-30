import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";
import { Note } from '@prisma/client';
 
async function GET(
	req: NextApiRequest,
	//   res: NextApiResponse<Note[]>
	res: NextApiResponse
) {
	const result = await prisma.note.findMany();
	res.status(200).json(result);
}

async function POST(
	req: NextApiRequest,
	res: NextApiResponse<Note>
) {
	const {title, content} = req.body;
	const result = await prisma.note.create({data:{title, content}});
	res.status(200).json(result);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") GET(req, res);
	if (req.method == "POST") POST(req, res);
}