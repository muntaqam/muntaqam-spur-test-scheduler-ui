export default function ScheduledSuites() {
    return (
        <div className="flex items-center justify-between p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold">Scheduled Suites</h1>

            {/* Button + Week Selector */}
            <div className="flex items-center gap-4">
                {/* Schedule Test Button */}
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700">
                    + Schedule Test
                </button>

                {/* Week of Date Selector */}
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
                    <button className="text-sm text-gray-700 hover:text-gray-900">←</button>
                    <span className="text-sm font-medium">Week of 10/09/24</span>
                    <button className="text-sm text-gray-700 hover:text-gray-900">→</button>
                </div>

                {/* Calendar Icon (if you want it) */}
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <i className="fas fa-calendar-alt"></i> {/* Replace with your icon */}
                </button>
            </div>
        </div>
    );
}
