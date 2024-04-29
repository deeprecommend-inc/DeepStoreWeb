import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Copyright } from "./Copyright";
import { color } from "../constants/const";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Alert, AlertColor } from "@mui/material";
import { TokenContext } from "@/lib/session";

export const LogIn = () => {
	const router = useRouter();
	const [canSubmit, setCanSubmit] = useState(true);
	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");
	const { setToken } = useContext(TokenContext);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setCanSubmit(false);
		const data = new FormData(event.currentTarget);
		const email = data.get("email") as string;
		const password = data.get("password") as string;

		const url = `${process.env.API_ROOT}/auth/login`;
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email, password })
		}).then(res => {
			switch (res.status) {
				case 200:
					setMsg("ログインに成功しました");
					setMsgType("info");
					res.json().then(data => {
						const token = data.token;
						setToken(token);
						router.push("/");
					});
					break;
				default:
					setMsg("ログインに失敗しました");
					setMsgType("error");
					setCanSubmit(true);
			}
		});
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
<<<<<<< HEAD
						ログイン
=======
						Sign in
>>>>>>> ce8caf833b2cf0d6361f42853845017fd7476b7b
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="メールアドレス"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="パスワード"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						{msg ?
							<Alert severity={msgType} variant="outlined">{msg}</Alert>
							: <></>}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2, backgroundColor: color.blue }}
							disabled={!canSubmit}
						>
							ログインする
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="/forgot" variant="body2">
									パスワードを忘れました
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									アカウントを作成する
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</>
	);
};