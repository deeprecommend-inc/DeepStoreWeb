import { TokenContext } from "@/lib/session";
import { useContext, useEffect } from "react";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import { Alert, AlertColor } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { isBlank, isGoodPassword, isValidEmail, isValidTelephoneNum } from "@/lib/validate";

export default function ProfilePage() {
	const {token, user} = useContext(TokenContext);
	const [canSubmit, setCanSubmit] = useState(true);
	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");

	const [name, setName] = useState(user?.name || "");
	const [tel, setTel] = useState(user?.tel || "");
	const [address, setAddress] = useState(user?.address || "");
	const [email, setEmail] = useState(user?.email || "");

	useEffect(() => {
		if (!user) return;
		if (name != user.name) setName(user.name);
		if (tel != user.tel) setTel(user.tel);
		if (address != user.address) setAddress(user.address);
		if (email != user.email) setEmail(user.email);
	}, [user]);

	const onError = (msg: string = "送信中にエラーが発生しました") => {
		setMsg(msg);
		setCanSubmit(true);
		setMsgType("error");
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!user) return;
		if (!token) return;
		if (isBlank(name)) {
			onError("名前を入力してください");
		} if (!isValidEmail(email)) {
			onError("メールアドレスが不正です");
		} else if (!isValidTelephoneNum(tel)) {
			onError("電話番号を数字10または11桁で入力してください");
		} else if (isBlank(address)) {
			onError("住所を入力してください");
		} else {
			setCanSubmit(false);
			setMsg("変更しています..");
			setMsgType("info");

			const abort = new AbortController();

			let modification: any = {};
			if (name != user.name) modification["name"] = name;
			if (email != user.email) modification["email"] = email;
			if (tel != user.tel) modification["tel"] = tel;
			if (address != user.address) modification["address"] = address;

			fetch("/api/auth/modify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify(modification),
				signal: abort.signal
			}).then(e => {
				switch (e.status) {
					case 200:
						setMsg(`変更できました`);
						setMsgType("success");
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
					ユーザー情報の編集
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
								value={name}
								onChange={e => setName(e.target.value)}
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
								value={tel}
								onChange={e => setTel(e.target.value)}
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
								value={address}
								onChange={e => setAddress(e.target.value)}
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
						変更
					</Button>
				</Box>
			</Box>
		</Container>

	);
}