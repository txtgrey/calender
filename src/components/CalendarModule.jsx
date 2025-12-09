import React, { useState, useEffect } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { format } from 'date-fns';

export const CalendarModule = ({ onRangeChange }) => {
    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        startTime: '00:00',
        endTime: '23:59',
    });

    const handleRangeUpdate = (newRange) => {
        setRange(newRange);
        if (onRangeChange) {
            onRangeChange(newRange);
        }
    };

    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
            <h1 className="text-3xl font-bold mb-8 text-orange-500">Calendar Module Demo</h1>
            <div className="w-full max-w-4xl p-6 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-200">Select Date Range</h2>
                </div>
                <DateRangePicker range={range} onChange={handleRangeUpdate} />

                <div className="mt-8 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Output Preview:</h3>
                    <pre className="text-xs text-green-400 font-mono overflow-auto">
                        {JSON.stringify(range, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};
