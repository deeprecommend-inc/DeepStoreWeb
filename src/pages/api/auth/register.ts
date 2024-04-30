import { sendVerificationLink } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { isBlank, isGoodPassword, isValidEmail, isValidTelephoneNum } from "@/lib/validate";
import { User } from "@prisma/client";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

async function POST(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {name, email, password, address, tel} = req.body as any as User;
	const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    
	if (isBlank(name)) {
		res.status(400).json({ msg: "名前を入力してください" });
		return;
	} if (!isValidEmail(email)) {
		res.status(400).json({ msg: "メールアドレスが不正です" });
		return;
	} else if (!isGoodPassword(password)) {
		res.status(400).json({ msg: "パスワードが短すぎます。8文字以上入力してください" });
		return;
	} else if (!isValidTelephoneNum(tel)) {
		res.status(400).json({ msg: "電話番号を数字10または11桁で入力してください" });
		return;
	} else if (isBlank(address)) {
		res.status(400).json({ msg: "住所を入力してください" });
		return;
	}

	await prisma.emailVerification.create({ data: { expired_at: new Date(), user: { create: { name, email, password: passwordHash, address, tel } } } })
		.then(async verification => 
			sendVerificationLink(await prisma.user.findUnique({where:{id:verification.userId}}) as User, verification.id)
		).then(e => res.status(200).json({msg: "success!"}))
		.catch(e => res.status(500).json({msg: e.toString() }));
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") POST(req, res);
}