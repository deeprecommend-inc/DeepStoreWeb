import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button } from "@mui/material";
import { color } from "../constants/const";
import { ReservationCalendar } from "./Calendar";
import { Qr } from "./Qr";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { Copyright } from "./Copyright";
import NavBar from "./NavBar";

export const Dashboard = () => {
	const { data: session } = useSession();

	return (
		<>
			<NavBar isLoggedIn={session != null} username={session?.user?.name || undefined} />
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
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						<Qr />
						<ReservationCalendar />
					</Container>
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						<Copyright sx={{ pt: 4 }} />
					</Container>
				</Box>
			</Box>
		</>
	);
};
