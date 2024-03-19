import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma"
import { Note } from '@prisma/client'
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
 
async function GET(
	req: NextApiRequest,
	//   res: NextApiResponse<Note[]>
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	const result = await prisma.note.findMany();
	const token = getToken({req});
	res.status(200).json({result, token, session:session });
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