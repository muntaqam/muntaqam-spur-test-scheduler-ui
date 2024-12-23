"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ScheduleModalContent from "@/components/schedule_modal";
import { createClient } from "@/utils/supabase/client";

export default function ScheduledSuitesAndCalendar() {
    // State to track the currently selected date (start of the week)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<{ id: number; title: string; day: number; startTime: Date }[]>([]);
    const [currentWeek, setCurrentWeek] = useState<{ day: string; date: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);


    const closeModal = () => {
        setIsOpen(false);
    };


    // Function to format the displayed week start date
    const formatWeekStart = (date: Date) => {
        return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    };

    // Function to adjust the selected week
    const adjustWeek = (direction: "previous" | "next") => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7)); // Add/Subtract 7 days
        setSelectedDate(newDate);
    };

    // Recalculate the current week whenever `selectedDate` changes
    useEffect(() => {
        const calculateWeekDates = () => {
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Set to Sunday
            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const week = daysOfWeek.map((day, index) => {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + index);
                return {
                    day,
                    date: date.toLocaleDateString([], { month: "short", day: "numeric" }),
                };
            });
            setCurrentWeek(week);
        };

        calculateWeekDates();
    }, [selectedDate]);

    const fetchSchedules = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase.from("schedules").select("*");
            if (error) {
                console.error("Error fetching schedules:", error.message);
                return;
            }
            const transformedEvents = data.flatMap((schedule) => {
                const startDateTime = new Date(schedule.start_time); // Convert `start_time` to a Date object
                const pstDateTime = new Date(
                    startDateTime.toLocaleString("en-US")
                ); // Convert UTC to PST

                return schedule.days.map((day: string) => ({
                    id: schedule.id,
                    title: schedule.test_suite,
                    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day),
                    startTime: pstDateTime, // Use PST Date object
                }));
            });

            setEvents(transformedEvents);
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    // Fetch events (Supabase)
    useEffect(() => {
        fetchSchedules();
    });

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const period = i < 12 ? "AM" : "PM";
        return `${hour} ${period}`;
    });

    return (
        <div className="w-full bg-white flex flex-col items-start p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-left">Scheduled Suites</h1>

            {/* Button + Week Selector */}
            <div className="flex items-center justify-start w-full gap-8 mb-6">
                {/* Dialog and Button */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700"
                            onClick={() => setIsOpen(true)} // Open the modal
                        >
                            + Schedule Test
                        </button>
                    </DialogTrigger>

                    {/* Modal Content */}
                    <ScheduleModalContent closeModal={closeModal} />
                </Dialog>

                {/* Week Selector */}
                <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2">
                    {/* Previous Week Button */}
                    <button
                        onClick={() => adjustWeek("previous")}
                        className="text-sm text-gray-700 hover:text-gray-900"
                    >
                        ←
                    </button>

                    {/* Current Week Display */}
                    <span className="text-sm font-medium">Week of {formatWeekStart(selectedDate)}</span>

                    {/* Next Week Button */}
                    <button
                        onClick={() => adjustWeek("next")}
                        className="text-sm text-gray-700 hover:text-gray-900"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6 bg-white rounded-lg h-full w-full">
                <div className="flex h-full">
                    <div className="relative overflow-y-auto max-h-[640px] flex w-full">
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
                        <div className="flex-1">
                            {/* Weekday Headers with Dates */}
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

                            <div>
                                {timeSlots.map((_, timeIndex) => (
                                    <div key={timeIndex} className="grid grid-cols-7 gap-0">
                                        {currentWeek.map((_, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className="h-20 border-b border-r border-gray-300 relative"
                                            >
                                                {events.map(
                                                    (event) =>
                                                        event.day === dayIndex &&
                                                        new Date(event.startTime).getHours() === timeIndex && ( // Match the hour
                                                            <div
                                                                key={event.id}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}