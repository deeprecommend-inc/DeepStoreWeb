import { EmailVerification, User } from "@prisma/client";
import nodemailer from "nodemailer";
export const transportor = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
})
export const from = `買取大吉 <${process.env.SMTP_FROM}>`;

export async function sendVerificationLink(user: User, verification: EmailVerification) {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from, to: user.email,
			subject: "ユーザー登録について",
			text: `登録を完了するには次の認証リンクをクリックしてください: ${process.env.APP_ROOT}/verify?token=${verification.id}`
		}
		transportor.sendMail(mailOptions, (error, info) => {
			if (error) {
				// 失敗時
				reject(error);
			} else {
				// 成功時
				resolve(info);
			};
		});
	});
}