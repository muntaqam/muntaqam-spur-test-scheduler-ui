"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ScheduleModalContent from "@/components/schedule_modal";

export default function ScheduledSuites() {
    // State to track the currently selected date (start of the week)
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    // Calculate the start of the current week (Sunday)
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to Sunday

    return (
        <div className="w-full bg-white flex flex-col items-start p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-left">Scheduled Suites</h1>

            {/* Button + Week Selector */}
            <div className="flex items-center justify-start w-full gap-8">
                {/* Dialog and Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700">
                            + Schedule Test
                        </button>
                    </DialogTrigger>

                    {/* Modal Content */}
                    <ScheduleModalContent />
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
                    <span className="text-sm font-medium">Week of {formatWeekStart(weekStart)}</span>

                    {/* Next Week Button */}
                    <button
                        onClick={() => adjustWeek("next")}
                        className="text-sm text-gray-700 hover:text-gray-900"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
