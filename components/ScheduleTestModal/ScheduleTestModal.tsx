"use client";

import { useState, useEffect } from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ScheduleTestModalProps {
    closeModal: () => void;
}

export default function ScheduleTestModal({ closeModal }: ScheduleTestModalProps) {
    const [selectedDays, setSelectedDays] = useState<string[]>(["Mon"]);
    const [testSuite, setTestSuite] = useState(""); // currently Selected test suite
    const [startDate, setStartDate] = useState("");
    const [testSuites, setTestSuites] = useState<string[]>([]); // List of test suites
    const [isAddingNew, setIsAddingNew] = useState(false); // Flag for adding a new test suite
    const [newTestSuiteName, setNewTestSuiteName] = useState(""); // New test suite name

    // set defualt startDate to current date + time
    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 16);
        setStartDate(formattedDate);
    }, []);

    // Fetch distinct test suites from the schedules table
    useEffect(() => {
        const fetchTestSuites = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from("schedules")
                    .select("test_suite", { distinct: true });

                if (error) {
                    console.error("Error fetching test suites:", error.message);
                    return;
                }

                setTestSuites(data.map((suite: { test_suite: string }) => suite.test_suite));
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        };

        fetchTestSuites();
    }, []);

    //adds Selected days to array 
    const handleDayToggle = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };


    const handleSubmit = async () => {
        try {
            const supabase = createClient();

            // If adding a new test suite
            if (isAddingNew && newTestSuiteName.trim()) {
                const trimmedName = newTestSuiteName.trim(); // Sanitize the input

                // Add the new test suite to Supabase, use the local startDate directly without conversion
                const { error: addSuiteError } = await supabase.from("schedules").insert([
                    {
                        test_suite: trimmedName,
                        start_time: startDate, // Save as entered without conversion
                        days: selectedDays, // Use selected days
                    },
                ]);

                if (addSuiteError) {
                    console.error("Error adding new test suite:", addSuiteError.message);
                    alert("Failed to add new test suite. Please try again.");
                    return;
                }

                // Update local state after successfully adding a test suite
                setTestSuites((prev) => [...prev, trimmedName]);
                setTestSuite(trimmedName); // Set the new test suite as the current one
                setIsAddingNew(true); // Reset the flag
                setNewTestSuiteName(""); // Clear the input

                // Close the modal and exit to avoid redundant schedule insertion
                closeModal();
                //alert("Toast triggered");
                toast.success("Test suite added to schedule!");
                return;
            }

            // If not adding a new test suite, ensure one is selected
            if (!testSuite) {
                alert("Please select or add a test suite.");
                return;
            }

            // Save the schedule, use the local startDate directly without conversion
            const { error } = await supabase.from("schedules").insert([
                {
                    test_suite: testSuite,
                    start_time: startDate, // Save as entered without conversion
                    days: selectedDays,
                },
            ]);

            if (error) {
                console.error("Error saving schedule:", error.message);
                alert("Failed to save schedule. Please try again.");
                return;
            }

            // alert("Toast triggered");
            toast.success("Test suite added to schedule!");
            closeModal(); // Close the modal after successful save
            // alert("Schedule saved successfully!");
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };





    const handleCancel = async () => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("schedules")
                .delete()
                .eq("test_suite", testSuite);

            if (error) {
                console.error("Error canceling schedule:", error.message);
                alert("Failed to cancel schedule. Please try again.");
                return;
            }

            //alert("Schedule canceled successfully!");
            closeModal();

            // Refresh the list of test suites after deletion
            const { data } = await supabase
                .from("schedules")
                .select("test_suite", { distinct: true });
            setTestSuites(data.map((suite: { test_suite: string }) => suite.test_suite));
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
                {/* Test Suite Dropdown */}
                <div className="mb-4">
                    <Label htmlFor="test-suite" className="text-sm text-gray-700 font-medium">
                        Test Suite
                    </Label>
                    {!isAddingNew ? (
                        <select
                            id="test-suite"
                            value={testSuite}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "add-new") {
                                    setIsAddingNew(true);
                                    setTestSuite("");
                                } else {
                                    setTestSuite(value);
                                }
                            }}
                            className="border border-gray-300 rounded-md mt-1 w-full p-2"
                            required
                        >
                            <option value="" disabled>
                                Select a Test Suite
                            </option>
                            {testSuites.map((suite) => (
                                <option key={suite} value={suite}>
                                    {suite}
                                </option>
                            ))}
                            <option value="add-new">+ Add New Test Suite</option>
                        </select>
                    ) : (
                        <div className="flex items-center gap-2 mt-2">
                            <Input
                                value={newTestSuiteName}
                                onChange={(e) => setNewTestSuiteName(e.target.value)}
                                placeholder="New Test Suite Name"
                                className="border border-gray-300 rounded-md flex-1"
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Start Date and Time */}
                <div className="mb-2">
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
                        className="block border border-gray-300 rounded-md mt-1 w-full"
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
                        onClick={handleCancel}
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
            <ToastContainer />
        </DialogContent>
    );
}