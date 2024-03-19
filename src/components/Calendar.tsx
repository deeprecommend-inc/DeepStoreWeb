"use client";

import { useEffect, useState } from "react";
import { EventInput, EventClickArg, Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Divider from "@mui/material/Divider";
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Store } from "@prisma/client";

let eventGuid: number = 0;

export const ReservationCalendar = () => {
	const [events, setEvents] = useState<EventInput[]>([]);
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
		fetch("/api/reservation", {
			method: "POST",
			body: JSON.stringify({date, item, storeId})
		}).then(res => alert("予約に成功しました"))
			.catch(res => alert("予約に失敗しました"))
	}


	const addEvent = (id: string, title: string, date: string) => {
		const newEvents: EventInput[] = [...events];
		newEvents.push({ id, title, date, color: "red" });
		setEvents(newEvents);
	};

	const removeEvent = (id: string) => {
		const newEvents: EventInput[] = events.filter(
			(e: EventInput) => e.id != id
		);;
		setEvents(newEvents);
	};

	const handleDateClick = (clickInfo: DateClickArg) => {
		const title: string | null = prompt(
			"Please enter a new title for your event"
		);

		const eventId: string = createEventId();
		const calendarApi = clickInfo.view.calendar;
		calendarApi.unselect();
		if (title) {
			calendarApi.addEvent({
				id: eventId,
				title,
				start: clickInfo.dateStr,
				end: clickInfo.dateStr,
				allDay: clickInfo.allDay,
			});
			addEvent(eventId, title, clickInfo.dateStr);
		}
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.event.remove();
		removeEvent(clickInfo.event.id);
	};

	const createEventId = (): string => {
		return `event${++eventGuid}`;
	};

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
							<Button variant="contained" type="submit">予約する</Button>
						</Grid>
					</Box>
				</Container>
			</LocalizationProvider>
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events}
				selectable={true}
				dayMaxEvents={true}
				businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
				dateClick={(e: DateClickArg) => {
					if (e.dayEl.classList.contains("fc-day-past")) return;
					// handleDateClick(e);
				}}
				eventClick={(e: EventClickArg) => handleEventClick(e)}
				locale="ja"
			/>
			<Divider sx={{ marginTop: 2, marginBottom: 2 }} />
			<ul>
				<li>登録中のイベント(削除)</li>
				<ul>
					{events.map((e: EventInput) => (
						<li key={e.id}>
							{e.title}
							<span onClick={() => removeEvent(e.id!)}>(x)</span>
						</li>
					))}
				</ul>
			</ul>
		</>
	);
};
export default ReservationCalendar;