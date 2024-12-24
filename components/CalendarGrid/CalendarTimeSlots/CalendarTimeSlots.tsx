interface CalendarTimeSlotsProps {
  timeSlots: string[]
}

export default function CalendarTimeSlots({ timeSlots }: CalendarTimeSlotsProps) {
  return (
    <div className="flex-shrink-0 w-20">
      <div className="sticky top-0 z-10 h-12 bg-white text-gray-500 font-medium flex items-center justify-center">
        PST
      </div>
      {timeSlots.map((time, index) => (
        <div key={index} className="h-20 text-sm text-gray-500 flex items-center justify-start pl-4">
          {time}
        </div>
      ))}
    </div>
  )
}