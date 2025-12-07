import type { Event } from "../types";

export function toLocalInputValue(dt: string) {
    const d = new Date(dt);
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getGoogleCalendarUrl = (event: Event) => {
    const start =
        new Date(event.start_datetime)
            .toISOString()
            .replace(/[-:]/g, "")
            .split(".")[0] + "Z";

    const end = event.end_datetime
        ? new Date(event.end_datetime).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
        : "";

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        event.title
    )}&dates=${start}/${end}&details=${encodeURIComponent(
        event.description || ""
    )}&location=${encodeURIComponent(event.location || "")}`;
};

export const getOutlookCalendarIcs = (event: Event) => {
    const formatICSDate = (dateStr: string) =>
        new Date(dateStr).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const start = formatICSDate(event.start_datetime);
    const end = event.end_datetime ? formatICSDate(event.end_datetime) : start;

    const ics = `
        BEGIN:VCALENDAR
        VERSION:2.0
        BEGIN:VEVENT
        DTSTAMP:${start}
        DTSTART:${start}
        DTEND:${end}
        SUMMARY:${event.title}
        DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}
        LOCATION:${event.location || ""}
        END:VEVENT
        END:VCALENDAR`.trim();

    const blob = new Blob([ics], { type: "text/calendar" });
    return URL.createObjectURL(blob);
};
