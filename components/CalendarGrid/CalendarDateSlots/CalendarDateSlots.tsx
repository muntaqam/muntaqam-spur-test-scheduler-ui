import { CurrentDateType } from "../../types"

interface CalendarDateSlots {
  currentWeek: CurrentDateType[]
}

export default function CalendatDateSlots({ currentWeek }: CalendarDateSlots) {
  return (
    <div className="grid grid-cols-7 gap-0 border-t border-l border-gray-300 sticky top-0 bg-white z-10">
      {currentWeek.map((dayInfo, index) => (
        <div
          key={dayInfo.day}
          className={`h-20 flex items-center justify-center font-bold text-gray-700 bg-gray-100 ${index !== 6 ? "border-r border-gray-300" : ""
            } ${index === 0 ? "rounded-tl-lg" : ""} ${index === 6 ? "rounded-tr-lg" : ""}`}
        >
          <span className="text-lg font-semibold text-black mr-2">{dayInfo.date.split(" ")[1]}</span>
          <span className="text-sm text-gray-500">{dayInfo.day}</span>
        </div>
      ))}
    </div>
  )
}