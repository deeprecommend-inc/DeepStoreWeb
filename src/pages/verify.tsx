import {useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Alert, AlertColor, Button, } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

export default function VerifyPage() {
	const [status, setStatus] = useState(0);
	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");

	useEffect(() => {
		const url = `/api/auth/verify`;
		const searchParams = new URL(location.href).searchParams;
		const token = searchParams.get("token");
		const verificationResult = fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ token })
		}).then(res => {
			setStatus(res.status);
			if (res.ok) {
				setMsgType("info");
			} else {
				setMsgType("error");
			}
			res.json().then(data => {
				setMsg(data.msg);
			});
		});
	});

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
						width: "500px"
					}}
				>
					{status == 0 ? "ロード中.." :
						status == 200 ? <Alert variant="outlined" severity={msgType} action={<Link href="/login"><Button color="inherit" size="small">ログインする</Button></Link>}>認証に成功しました。</Alert>
							: <Alert variant="outlined" severity={msgType} action={<Link href="/register"><Button color="inherit" size="small">再登録する</Button></Link>}>認証に失敗しました: {msg}</Alert>}
				</Box>
			</Container>
		</>
	);
}