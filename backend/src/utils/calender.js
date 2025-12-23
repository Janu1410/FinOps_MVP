import { calendar, calendarId } from "../config/calender.js";
import { createZoomMeeting } from "./zoom.js";


export async function scheduleEvent(
  summary,
  description,
  preferredDateTime,
  timezone,
  durationMinutes = 60
) {
  try {
    const startDateTime = new Date(preferredDateTime);
    const endDateTime = new Date(
      startDateTime.getTime() + durationMinutes * 60000
    );

    // 1️⃣ Check free/busy
    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDateTime.toISOString(),
        timeMax: endDateTime.toISOString(),
        timeZone: timezone,
        items: [{ id: calendarId }],
      },
    });

    const calendarData = freeBusyResponse.data.calendars?.[calendarId];

    if (!calendarData) {
      return {
        success: false,
        message: `Calendar ${calendarId} not found or inaccessible`,
      };
    }

    if ((calendarData.busy || []).length > 0) {
      return { success: false, message: "Preferred slot is busy" };
    }

    // 2️⃣ Create Zoom meeting
    const zoomLink = await createZoomMeeting(
      summary,
      startDateTime.toISOString().replace(".000", ""),
      durationMinutes
    );

    // 3️⃣ Create Google Calendar event
    const event = {
      summary,
      description: `${description}\n\nJoin Zoom: ${zoomLink}`,
      location: zoomLink,
      start: { dateTime: startDateTime.toISOString(), timeZone: timezone },
      end: { dateTime: endDateTime.toISOString(), timeZone: timezone },
    };

    const response = await calendar.events.insert({
      calendarId,
      resource: event,
    });

    return {
      success: true,
      meetingLink: zoomLink,
      event: response.data,
    };
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return { success: false, message: error.message };
  }
}





export async function getFreeSlots(
  fromISO,
  toISO,
  timezone,
  slotMinutes = 60,
  workStartHour = 10,
  workEndHour = 18
) {
  // 1️⃣ Fetch busy slots
  const fb = await calendar.freebusy.query({
    requestBody: {
      timeMin: fromISO,
      timeMax: toISO,
      timeZone: timezone,
      items: [{ id: calendarId }],
    },
  });

  const busy = fb.data.calendars?.[calendarId]?.busy || [];
  const freeSlots = [];

  let current = new Date(fromISO);
  const endRange = new Date(toISO);

  while (current < endRange) {
    const day = current.getDay(); // local day
    const hour = current.getHours();

    // Skip weekends
    if (day === 0 || day === 6) {
      current.setDate(current.getDate() + 1);
      current.setHours(workStartHour, 0, 0, 0);
      continue;
    }

    // Enforce working hours
    if (hour < workStartHour) {
      current.setHours(workStartHour, 0, 0, 0);
    }

    if (hour >= workEndHour) {
      current.setDate(current.getDate() + 1);
      current.setHours(workStartHour, 0, 0, 0);
      continue;
    }

    const slotStart = new Date(current);
    const slotEnd = new Date(
      slotStart.getTime() + slotMinutes * 60000
    );

    // Slot spills past working hours
    if (slotEnd.getHours() > workEndHour) {
      current.setDate(current.getDate() + 1);
      current.setHours(workStartHour, 0, 0, 0);
      continue;
    }

    // Check overlap
    const isBusy = busy.some(b =>
      new Date(b.start) < slotEnd &&
      new Date(b.end) > slotStart
    );

    if (!isBusy) {
      freeSlots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      });
    }

    // Move to next slot
    current = slotEnd;
  }

  return freeSlots;
}
