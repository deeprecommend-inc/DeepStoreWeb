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
import { Reservation, Store } from "@prisma/client";
import { Table, TableCell, TableBody, TableHead, TableRow, Typography } from "@mui/material";

export const Dashboard = () => {
	const { token, setToken } = useContext(TokenContext);
	const [reservations, setReservations] = useState<Reservation[]>([]);

	useEffect(() => {
		if (!token) return;
		// ログイン中のユーザーの予約状況を取得
		fetch("/api/reservations", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			}
		})
			.then(res => res.json())
			.then((data: Reservation[]) => setReservations(data.map(e => ({
				...e,
				date: new Date(e.date),
				created_at: new Date(e.created_at),
				updated_at: new Date(e.updated_at),
			}))));
	}, [token]);



	return (
		<>
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
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: { md: "flex", sm: "block" } }}>
						<ReservationForm />
						<Container sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
							<Qr />
						</Container>
					</Container>
					{token != null && 
						<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
							<Typography component="h1" variant="h5">予約履歴</Typography>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>日付</TableCell>
										<TableCell>商品名</TableCell>
										<TableCell>店舗</TableCell>
										<TableCell>予約した日</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{reservations.map(reservation =>
										<TableRow component="th" scope="row" key={reservation.id}>
											<TableCell>{reservation.date.toDateString()}</TableCell>
											<TableCell>{reservation.item}</TableCell>
											<TableCell>{(reservation as any as { store: Store }).store.name}</TableCell>
											<TableCell>{reservation.created_at.toDateString()}</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</Container>
					}
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						<Copyright sx={{ pt: 4 }} />
					</Container>
				</Box>
			</Box>
		</>
	);
};
