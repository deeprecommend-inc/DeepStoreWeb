import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertColor, Button, ThemeProvider } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { defaultTheme } from "@/lib/defaultTheme";

export default function VerifyPage({ success }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
					{success ? <Alert variant="outlined" severity="success" action={<Link href="/login"><Button color="inherit" size="small">ログインする</Button></Link>}>認証に成功しました。</Alert>
						: <Alert variant="outlined" severity="error" action={<Link href="/register"><Button color="inherit" size="small">再登録する</Button></Link>}>認証に失敗しました</Alert>}
				</Box>
			</Container>
		</ThemeProvider>
	);
}

export const getServerSideProps = (async function(context) {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const token = context.query.token;
	if (!token) return {props: {success: false}};
	const url = `${process.env.APP_ROOT}/api/auth/verify`;
	const verificationResult = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({token})
	});
	return {props: {success: verificationResult.status == 200}};
}) satisfies GetServerSideProps<{success: boolean}>;