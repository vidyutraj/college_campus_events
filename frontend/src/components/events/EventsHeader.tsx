interface Props {
    myEventsOnly: boolean;
    showFilters: boolean;
    toggleFilters: () => void;
    hasActiveFilters: boolean;
}

export default function EventsHeader({
    myEventsOnly,
    showFilters,
    toggleFilters,
    hasActiveFilters,
}: Props) {
    return (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
                {myEventsOnly && "My "} Upcoming Events
            </h2>

            <button
                onClick={toggleFilters}
                className="btn-primary px-6 py-2 rounded-full relative"
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
                {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
            </button>
        </div>
    );
}
