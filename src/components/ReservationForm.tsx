"use client";

import { Alert, AlertColor, Avatar, Box, Button, Container, CssBaseline, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {useState, useEffect} from "react";
import { Store } from "@prisma/client";
import { CreateOutlined } from "@mui/icons-material";
import { color } from "../constants/const";

export default function ReservationForm() {
	const [canSubmit, setCanSubmit] = useState(true);
	const [msg, setMsg] = useState("");
	const [msgType, setMsgType] = useState<AlertColor>("success");
	const [stores, setStores] = useState<Store[]>([]);

	useEffect(() => {
		fetch("/api/stores").then(res=>res.json()).then(json=>setStores(json));
	}, []);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const item = data.get("item");
		const date = data.get("date");
		const storeId = data.get("store");
		fetch("/api/reservations", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({date, item, storeId})})
			.then(res => alert("予約に成功しました"))
			.catch(res => alert("予約に失敗しました"));
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
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
						<CreateOutlined />
					</Avatar>
					<Typography component="h1" variant="h5" sx={{ pb: 2 }}>
						予約する
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{mt: 1}}
					>
						<DatePicker 
							name="date"
							label="予約日" 
							sx={{width: "100%"}}
						/>
						<FormControl sx={{mt: 3, mb:2}} fullWidth>
							<InputLabel id="selection-for-store-label">店舗</InputLabel>
							<Select labelId="selection-for-store-label" name="store">
								{stores.map(store => <MenuItem value={store.id} key={store.id}>{store.name}</MenuItem>)}
							</Select>
						</FormControl>
						<TextField label="商品名" name="item" fullWidth/>
						{msg ?
							<Alert variant="outlined" severity={msgType} sx={{ mt: 3 }}>
								{msg}
							</Alert>
							: <></>}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2, backgroundColor: color.blue }}
							disabled={!canSubmit}
						>
							予約する
						</Button>
					</Box>
				</Box>
			</Container>
		</LocalizationProvider>);
}