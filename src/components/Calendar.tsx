"use client";

import { useEffect, useState } from "react";
import { EventInput, EventClickArg, Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Divider from "@mui/material/Divider";
import { Alert, AlertColor, Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Reservation, Store } from "@prisma/client";

export const ReservationCalendar = () => {
	const [stores, setStores] = useState<Store[]>([]);
	const [reservations, setReservations] = useState<Reservation[]>([]);

	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");

	useEffect(() => {
		fetch("/api/stores").then(res=>res.json()).then(json=>setStores(json));
	}, []);
	useEffect(() => {
		fetch("/api/reservations").then(res=>res.json()).then(json=>setReservations(json));
	}, []);
	console.log(reservations);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const item = data.get("item");
		const date = data.get("date");
		const storeId = data.get("store");
		fetch("/api/reservations", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({date, item, storeId})
		}).then(res => alert("予約に成功しました"))
			.catch(res => alert("予約に失敗しました"))
	}

	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Container>
					<Typography component="h1" variant="h5" sx={{pb:2}}>
						予約する
					</Typography>
					<Box component="form" onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<DatePicker name="date" label="予約日" />
							<FormControl sx={{ minWidth: 200 }}>
								<InputLabel id="selection-for-store-label">店舗</InputLabel>
								<Select labelId="selection-for-store-label" name="store">
									{stores.map(store => <MenuItem value={store.id} key={store.id}>{store.name}</MenuItem>)}
								</Select>
							</FormControl>
							<TextField label="商品名" name="item"/>
							{msg ?
								<Alert variant="outlined" severity={msgType} sx={{ mt: 3 }}>
									{msg}
								</Alert>
								: <></>}
							<Button variant="contained" type="submit">予約する</Button>
						</Grid>
					</Box>
				</Container>
			</LocalizationProvider>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={reservations.map(res => ({start:res.date.toString().split("T")[0], end: res.date.toString().split("T")[0], title: res.item}))}
				selectable={true}
				dayMaxEvents={true}
				businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
				locale="ja"
			/>
			<Divider sx={{ marginTop: 2, marginBottom: 2 }} />
		</>
	);
};
export default ReservationCalendar;