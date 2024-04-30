import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Copyright } from "./Copyright";
import { useState } from "react";
import { Alert, AlertColor } from "@mui/material";
import { isBlank, isGoodPassword, isValidEmail, isValidTelephoneNum } from "@/lib/validate";

export const SignUp = () => {
	const [canSubmit, setCanSubmit] = useState(true);
	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");
	// エラーメッセージを設定するユーティリティ関数
	const onError = (msg: string = "送信中にエラーが発生しました") => {
		setMsg(msg);
		setCanSubmit(true);
		setMsgType("error");
	};
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const data = new FormData(event.currentTarget);
		const name = data.get("name") as string;
		const email = data.get("email") as string;
		const password = data.get("password") as string;
		const tel = data.get("tel") as string;
		const address = data.get("address") as string;

		event.preventDefault();

		if (isBlank(name)) {
			onError("名前を入力してください");
		} if (!isValidEmail(email)) {
			onError("メールアドレスが不正です");
		} else if (isGoodPassword(password)) {
			onError("パスワードが短すぎます。8文字以上入力してください");
		} else if (!isValidTelephoneNum(tel)) {
			onError("電話番号を数字10または11桁で入力してください");
		} else if (isBlank(address)) {
			onError("住所を入力してください");
		} else {
			setCanSubmit(false);
			setMsg("送信しています..");
			setMsgType("info");

			const url = `/api/auth/register`;
			const abort = new AbortController();
			fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password, tel, address }),
				signal: abort.signal
			}).then(e => {
				switch (e.status) {
					case 200:
						setMsg(`${email}に認証リンクを送信しました`);
						setMsgType("success");
						return;
					case 500: // bad request
						onError(`すでに${email}で登録されています`);
						return;
					default:
						onError();
						return;
				}
			}).catch(error => onError(error.toString()));
			return () => { abort.abort(); onError("登録を中断しました"); };
		}
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						ユーザー登録
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									autoComplete="name"
									name="name"
									label="名前"
									required
									fullWidth
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="tel"
									name="tel"
									label="電話番号"
									required
									fullWidth
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="address-level1"
									name="address"
									label="住所"
									required
									fullWidth
									autoFocus
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="email"
									name="email"
									label="メールアドレス"
									type="email"
									required
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									autoComplete="new-password"
									name="password"
									label="パスワード"
									type="password"
									required
									fullWidth
								/>
							</Grid>
						</Grid>
						{msg ?
							<Alert variant="outlined" severity={msgType} sx={{ mt: 3 }}>
								{msg}
							</Alert>
							: <></>}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={!canSubmit}
						>
							登録
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									ログインする
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</>
	);
};
