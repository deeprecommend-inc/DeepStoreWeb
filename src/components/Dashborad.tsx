import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Qr } from "./Qr";
import { useContext, useEffect, useState } from "react";
import { Copyright } from "./Copyright";
import NavBar from "./NavBar";
import { TokenContext } from "@/lib/session";
import ReservationForm from "./ReservationForm";

export const Dashboard = () => {
	const { token, setToken } = useContext(TokenContext);
	const [username, setUsername] = useState("ロード中..");
	useEffect(() => {
		if (!token) return;
		const url = `/api/auth/current`;
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}})
			.then(res => {
				switch (res?.status){
					case 200:
						if (res != null) {
							res.json().then(user => setUsername(user.name));
							break;
						}
					default:
						// 無効なtoken
						setToken(null);
				}
			});
	}, [token]);
	const logout = () => {
		const url = "/api/auth/logout";
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});
		setToken(null);
	};


	return (
		<>
			<NavBar isLoggedIn={token != null} username={username} logout={logout} />
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						height: "100vh",
						overflow: "auto",
					}}
				>
					<Toolbar />
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: {md: "flex", sm: "block"} }}>
						<ReservationForm />
						<Container sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
							<Qr />
						</Container>
					</Container>
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						<Copyright sx={{ pt: 4 }} />
					</Container>
				</Box>
			</Box>
		</>
	);
};
