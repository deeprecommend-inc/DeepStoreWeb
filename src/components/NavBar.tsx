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
<<<<<<< HEAD
=======
import { useSession, signIn, signOut } from "next-auth/react"
>>>>>>> ce8caf833b2cf0d6361f42853845017fd7476b7b
import { Copyright } from "./Copyright";

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
}));

type NavBarProps = {
	isLoggedIn: boolean,
	username?: string,
	logout: () => void
}

export default function NavBar({ isLoggedIn, username, logout }: NavBarProps) {
	return (
		<AppBar position="absolute" sx={{ boxShadow: "none" }}>
			<Toolbar
				sx={{
					pr: "24px", // keep right padding when drawer closed
					backgroundColor: color.blue,
				}}
			>
				<Typography
					component="h1"
					variant="h6"
					color="inherit"
					noWrap
					sx={{ flexGrow: 1 }}
				>
					出張買取予約 大吉初芝駅前店
				</Typography>
				<div className="grid grid-cols-3 gap-2">
					{isLoggedIn ? (<>
						<IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<Button variant="text">予約する</Button>
						{username ? <Button variant="text" sx={{ color: "white" }}>
							{username}
						</Button> : <></>}
						<Button
							variant="text"
							sx={{ color: "white" }}
<<<<<<< HEAD
							onClick={logout}>
=======
							onClick={() => signOut()}>
>>>>>>> ce8caf833b2cf0d6361f42853845017fd7476b7b
							ログアウト
						</Button>
					</>) : (<>
						<Link href="/signup">
							<Button
								variant="text"
								sx={{ color: "white" }}
							>
								ユーザー登録
							</Button>
						</Link>
<<<<<<< HEAD
						<Link href="/login">
							<Button
								variant="text"
								sx={{ color: "white" }}
							>
								ログイン
							</Button>
						</Link>
					</>)}
				</div>
			</Toolbar>
		</AppBar>);
=======
						<Button
							variant="text"
							sx={{ color: "white" }}
							onClick={() => signIn()}
						>
							ログイン
						</Button>
					</>)}
				</div>
			</Toolbar>
		</AppBar>)
>>>>>>> ce8caf833b2cf0d6361f42853845017fd7476b7b
};