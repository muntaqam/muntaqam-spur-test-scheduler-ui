"use client";

import { useState, useEffect } from "react";
import type { CalendarEventsType, CurrentDateType } from "./types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import ScheduleTestModal from "./ScheduleTestModal/ScheduleTestModal";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import WeekSelector from "./WeekSelector/WeekSelector";

export default function ScheduledSuitesAndCalendar() {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const [selectedDate, setSelectedDate] = useState(startOfWeek);
  const [events, setEvents] = useState<CalendarEventsType[]>([]);
  const [currentWeek, setCurrentWeek] = useState<CurrentDateType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

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

  useEffect(() => {
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
        const pstDateTime = new Date(startDateTime.toLocaleString("en-US"))

        return schedule.days.map((day: string) => ({
          id: schedule.id,
          title: schedule.test_suite,
          day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day),
          startTime: pstDateTime,
          startDate: startDateTime
        }));
      });

      setEvents(transformedEvents);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  });

  return (
    <div className="w-full bg-white flex flex-col items-start p-6">
      <h1 className="text-2xl font-bold mb-6 text-left">Scheduled Suites</h1>
      <div className="flex items-center justify-start w-full gap-8 mb-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700"
              onClick={() => setIsOpen(true)} // Open the modal
            >
              + Schedule Test
            </button>
          </DialogTrigger>
          <ScheduleTestModal closeModal={closeModal} />
        </Dialog>
        <WeekSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
      <CalendarGrid currentWeek={currentWeek} events={events} />
    </div>
  );
}