interface WeekSelectorProps {
  selectedDate: Date;
  setSelectedDate: (newDate: Date) => void;
}

export default function WeekSelector({ selectedDate, setSelectedDate }: WeekSelectorProps) {
  const adjustWeek = (direction: "previous" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7)); // Add/Subtract 7 days
    setSelectedDate(newDate);
  };

  const formatWeekStart = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  };

  return (
    <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2">
      <button
        onClick={() => adjustWeek("previous")}
        className="text-sm text-gray-700 hover:text-gray-900"
      >
        ←
      </button>
      <span className="text-sm font-medium">Week of {formatWeekStart(selectedDate)}</span>
      <button
        onClick={() => adjustWeek("next")}
        className="text-sm text-gray-700 hover:text-gray-900"
      >
        →
      </button>
    </div>
  )
}