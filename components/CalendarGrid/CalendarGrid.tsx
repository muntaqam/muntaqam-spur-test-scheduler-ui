import type { CalendarEventsType, CurrentDateType } from "../types";
import CalendarDateSlots from "./CalendarDateSlots/CalendarDateSlots";
import CalendarTimeSlots from "./CalendarTimeSlots/CalendarTimeSlots";
import CalendarGridContent from "./CalendarGridContent/CalendarGridContent";

interface CalendarGridProps {
  currentWeek: CurrentDateType[],
  events: CalendarEventsType[],
}

export default function CalendarGrid({ currentWeek, events }: CalendarGridProps) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "AM" : "PM";
    return `${hour} ${period}`;
  });

  return (
    <div className="p-6 bg-white rounded-lg h-full w-full">
      <div className="flex h-full">
        <div className="relative overflow-y-auto max-h-[640px] flex w-full">
          <CalendarTimeSlots timeSlots={timeSlots} />
          <div className="flex-1">
            <CalendarDateSlots currentWeek={currentWeek} />
            <CalendarGridContent timeSlots={timeSlots} currentWeek={currentWeek} events={events} />
          </div>
        </div>
      </div>
    </div>
  )
}