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
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
};

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
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

export function isSameDate(date1: string | Date, date2: string | Date) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export function formatModality(modality: string) {
    switch (modality) {
        case "in-person":
            return "In-Person";
        case "online":
            return "Online";
        case "hybrid":
            return "Hybrid";
        default:
            return modality;
    }
}