import type { CalendarEventsType, CurrentDateType } from "@/components/types";

interface CalendarGridContentProps {
  timeSlots: string[],
  currentWeek: CurrentDateType[],
  events: CalendarEventsType[],
}

export default function CalendarGridContent({ timeSlots, currentWeek, events }: CalendarGridContentProps) {
  return (
    <div>
      {timeSlots.map((_, timeSlotIndex) => (
        <div key={timeSlotIndex} className="grid grid-cols-7 gap-0">
          {currentWeek.map((currentWeekDay, currentWeekDayIndex) => (
            <div
              key={currentWeekDayIndex}
              className="h-20 border-b border-r border-gray-300 relative"
            >
              {events.map(
                (event) =>
                  // event.startDate >= new Date(`${currentWeekDay.date}, ${new Date().getFullYear()}`) &&
                  event.day === currentWeekDayIndex &&
                  new Date(event.startTime).getHours() === timeSlotIndex && ( // Match the hour
                    <div
                      key={`${event.id}-${event.day}`}
                      className="absolute top-1 left-1 right-1 h-16 bg-blue-50 text-blue-700 rounded-lg shadow-md flex flex-col items-start justify-center px-4 border border-blue-400"
                    >
                      <span className="font-semibold text-blue-700">{event.title}</span>
                      <span className="flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        {event.startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        PST
                      </span>
                    </div>
                  )
              )}

            </div>
          ))}
        </div>
      ))}
    </div>
  )
}