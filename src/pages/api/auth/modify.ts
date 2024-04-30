import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { isBlank, isValidEmail, isValidTelephoneNum } from "@/lib/validate";

async function POST(req: NextApiRequest, res: NextApiResponse) {
	// Authrozation: Bearer <token>
	const token = req.headers.authorization?.substring(7);
	if (!token) {
		res.status(401).json({msg: "no token"});
		return;
	}
	const {name, email, tel, address} = req.body;
	let modification: any = {};
	if (name && !isBlank(name)) modification["name"] = name;
	if (email && isValidEmail(email)) modification["email"] = email;
	if (tel && isValidTelephoneNum(tel)) modification["tel"] = tel;
	if (address && !isBlank(address)) modification["address"] = address;

	const userId = (await prisma.session.findUnique({where:{id: token}}))?.userId;
	if (!userId) {
		res.status(401).json({msg: "token is invalid"});
		return;
	}
	
	await prisma.user.update({
		where: { id: userId },
		data: modification })
		.then(e => {
			res.status(200).json((e as any)[0]);
		})
		.catch(e => res.status(500).json({ msg: e.toString() }));
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}