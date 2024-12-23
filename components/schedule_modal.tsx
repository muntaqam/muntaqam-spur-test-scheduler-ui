"use client";

import { useState } from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { createClient } from "@/utils/supabase/client";


export default function ScheduleModalContent() {
    const [selectedDays, setSelectedDays] = useState<string[]>(["Mon"]);
    const [testSuite, setTestSuite] = useState("Demo Suite");
    const [startDate, setStartDate] = useState("2024-10-10T07:00");

    const handleDayToggle = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };


    const handleSubmit = async () => {
        try {
            const supabase = createClient(); // Create a new Supabase client instance
            const { data, error } = await supabase.from("schedules").insert([
                {
                    test_suite: testSuite,
                    start_time: new Date(startDate).toISOString(),
                    days: selectedDays,
                },
            ]);

            if (error) {
                console.error("Error saving schedule:", error.message);
                alert("Failed to save schedule. Please try again.");
                return;
            }

            alert("Schedule saved successfully!");
            console.log("Saved schedule:", data);
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };




    return (
        <DialogContent className="bg-white rounded-lg shadow-md p-6">
            <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                    Schedule Detail
                </DialogTitle>
            </DialogHeader>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {/* Test Suite */}
                <div className="mb-4">
                    <Label htmlFor="test-suite" className="text-sm text-gray-700 font-medium">
                        Test Suite
                    </Label>
                    <Input
                        id="test-suite"
                        value={testSuite}
                        onChange={(e) => setTestSuite(e.target.value)}
                        className="border border-gray-300 rounded-md mt-1 w-full"
                    />
                </div>

                {/* Start Date and Time */}
                <div className="mb-4">
                    <Label
                        htmlFor="start-date"
                        className="text-sm text-gray-700 font-medium"
                    >
                        Start Date and Time
                    </Label>
                    <Input
                        id="start-date"
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-md mt-1 w-full"
                    />
                </div>

                {/* Run Weekly on Every */}
                <div className="mb-4">
                    <Label className="text-sm text-gray-700 font-medium">
                        Run Weekly on Every
                    </Label>
                    <div className="flex gap-2 mt-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <button
                                type="button"
                                key={day}
                                onClick={() => handleDayToggle(day)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${selectedDays.includes(day)
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Buttons */}
                <DialogFooter className="mt-6 flex items-center justify-end gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        className="bg-red-50 text-red-600 hover:bg-red-100"
                    >
                        Cancel Schedule
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
