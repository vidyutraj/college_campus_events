import { LuCalendar, LuList } from "react-icons/lu";

interface Props {
    view: "list" | "calendar";
    setView: (view: "list" | "calendar") => void;
}

export default function EventsViewSwitcher({ view, setView }: Props) {
    return (
        <div className="hidden sm:flex mb-6 w-full">
            <button
                onClick={() => setView("list")}
                className={`w-1/2 px-4 py-2 btn border-y border-l rounded-l-lg ${
                    view === "list"
                        ? "bg-secondary font-medium border-secondary-dark text-background"
                        : "border-foreground/50"
                }`}
            >
                <LuList /> List View
            </button>

            <button
                onClick={() => setView("calendar")}
                className={`w-1/2 px-4 py-2 btn border-y border-r rounded-r-lg ${
                    view === "calendar"
                        ? "bg-secondary font-medium border-secondary-dark text-background"
                        : "border-foreground/50"
                }`}
            >
                <LuCalendar /> Calendar View
            </button>
        </div>
    );
}
