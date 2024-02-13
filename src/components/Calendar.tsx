"use client";

import { useState } from "react";
import { EventInput, EventClickArg, Calendar } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import Divider from "@mui/material/Divider";

let eventGuid: number = 0;

export const ReservationCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  const addEvent = (id: string, title: string, date: string) => {
    const newEvents: EventInput[] = [...events];
    newEvents.push({ id, title, date, color: "red" });
    setEvents(newEvents);
  };

  const removeEvent = (id: string) => {
    const newEvents: EventInput[] = events.filter(
      (e: EventInput) => e.id != id
    );
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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        dayMaxEvents={true}
        businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
        dateClick={(e: DateClickArg) => {
          if (e.dayEl.classList.contains("fc-day-past")) return;
          handleDateClick(e);
        }}
        eventClick={(e: EventClickArg) => handleEventClick(e)}
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
