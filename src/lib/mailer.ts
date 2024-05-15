import { EmailVerification, Reservation, Store, User } from "@prisma/client";
import nodemailer from "nodemailer";
export const transportor = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
})
export const from = `買取大吉予約システム <${process.env.SMTP_FROM}>`;

export async function sendReservationNotification(user: User, reservation: Reservation, store: Store) {
	return new Promise((resolve, reject) => {
		const date = `${reservation.date.getFullYear()}年${reservation.date.getMonth() + 1}月${reservation.date.getDate()}日`;
		const mailOptions = {
			from, to: store.mail,
			subject: `[${date}]予約を承りました`,
			text: `予約を承りました。
日付：${date}
店舗：${store.name}
商品名：${reservation.item}
予約者名：${user.name}
予約者のメールアドレス：${user.email}
予約者の電話番号：${user.tel}`
		};
		transportor.sendMail(mailOptions, (error, info) => {
			if (error) {
				// 失敗時
				reject(error);
			} else {
				// 成功時
				resolve(info);
			};
		})
	});
}

export async function sendPasswordResetLink(user: User, token: String) {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from, to: user.email,
			subject: "パスワードのリセットについて",
			text: `パスワードをリセットするにはリンクをクリックしてください: ${process.env.APP_ROOT}/reset?token=${token}`
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

export async function sendVerificationLink(user: User, token: String) {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from, to: user.email,
			subject: "ユーザー登録について",
			text: `登録を完了するには次の認証リンクをクリックしてください: ${process.env.APP_ROOT}/verify?token=${token}`
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