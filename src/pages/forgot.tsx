import * as React from "react";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Copyright } from "../components/Copyright";
import { color } from "../constants/const";
import { useRouter } from "next/router";
import { useState } from "react";
import { Alert, AlertColor } from "@mui/material";
import { defaultTheme } from "@/lib/defaultTheme";

export default function ForgotPage() {
	const router = useRouter();
	const [canSubmit, setCanSubmit] = useState(true);
	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setCanSubmit(false);
		const data = new FormData(event.currentTarget);
		const email = data.get("email") as string;

		const url = `${process.env.API_ROOT}/auth/forgot`
		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({email})
		}).then(res => {
			switch (res.status) {
			case 200:
				setMsg("メールを送信しました");
				setMsgType("info");
				return;
			default:
				setMsg(`${email}のユーザーが見つかりません`)
				setMsgType("error");
				setCanSubmit(true);
			}
		})
	};

	return (
		<ThemeProvider theme={defaultTheme}>
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
            パスワードの再発行
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
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
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
							パスワードを再発行する
						</Button>
					</Box>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
};
