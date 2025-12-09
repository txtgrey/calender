import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export const TimePicker = ({ startDate, endDate, startTime, endTime, onChange }) => {
    // Helper to convert 24h "HH:mm" to 12h "hh:mm"
    const to12Hour = (timeStr) => {
        if (!timeStr) return '';
        const [hours, mins] = timeStr.split(':');
        let h = parseInt(hours, 10);
        if (h === 0) h = 12;
        else if (h > 12) h -= 12;
        return `${h.toString().padStart(2, '0')}:${mins}`;
    };

    // Helper to convert 12h "hh:mm" + AM/PM to 24h "HH:mm"
    const to24Hour = (timeStr, amPm) => {
        if (!timeStr) return '';
        const [hours, mins] = timeStr.split(':');
        let h = parseInt(hours, 10);
        if (amPm === 'PM' && h < 12) h += 12;
        if (amPm === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${mins}`;
    };

    const getAmPm = (timeStr) => {
        if (!timeStr) return 'AM';
        const hours = parseInt(timeStr.split(':')[0], 10);
        return hours >= 12 ? 'PM' : 'AM';
    };

    // Local state for inputs to allow typing
    const [startInput, setStartInput] = useState(to12Hour(startTime));
    const [endInput, setEndInput] = useState(to12Hour(endTime));

    // Sync local state when props change (e.g. from quick select)
    useEffect(() => {
        setStartInput(to12Hour(startTime));
    }, [startTime]);

    useEffect(() => {
        setEndInput(to12Hour(endTime));
    }, [endTime]);

    const handleInputChange = (type, value, current24h) => {
        // Allow only numbers and colon
        if (!/^[\d:]*$/.test(value)) return;

        // Auto-insert colon if user types 3rd digit without colon
        if (value.length === 3 && !value.includes(':')) {
            value = value.slice(0, 2) + ':' + value.slice(2);
        }

        if (value.length > 5) return;

        if (type === 'startTime') setStartInput(value);
        else setEndInput(value);

        // Validate and update parent if complete
        if (value.length === 5) {
            const [h, m] = value.split(':');
            const numH = parseInt(h, 10);
            const numM = parseInt(m, 10);

            if (numH >= 1 && numH <= 12 && numM >= 0 && numM <= 59) {
                const currentAmPm = getAmPm(current24h);
                const new24h = to24Hour(value, currentAmPm);
                onChange(type, new24h);
            }
        }
    };

    const handleAmPmToggle = (type, current24h) => {
        const currentAmPm = getAmPm(current24h);
        const newAmPm = currentAmPm === 'AM' ? 'PM' : 'AM';

        // Convert current 24h time to 12h, then back to 24h with new AM/PM
        const time12 = to12Hour(current24h);
        const new24h = to24Hour(time12, newAmPm);
        onChange(type, new24h);
    };

    return (
        <div className="flex flex-col gap-5 h-full pt-1">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Start Time</label>
                    {startDate && (
                        <span className="text-[10px] text-orange-500 font-medium">
                            {format(startDate, 'dd MMM')}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={startInput}
                            onChange={(e) => handleInputChange('startTime', e.target.value, startTime)}
                            placeholder="00:00"
                            className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono placeholder-neutral-600"
                        />
                    </div>
                    <div className="flex bg-neutral-800 rounded-lg border border-neutral-700 p-1 shrink-0">
                        <button
                            onClick={() => getAmPm(startTime) === 'PM' && handleAmPmToggle('startTime', startTime)}
                            className={clsx(
                                "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                                getAmPm(startTime) === 'AM' ? "bg-neutral-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            AM
                        </button>
                        <button
                            onClick={() => getAmPm(startTime) === 'AM' && handleAmPmToggle('startTime', startTime)}
                            className={clsx(
                                "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                                getAmPm(startTime) === 'PM' ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            PM
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">End Time</label>
                    {endDate && (
                        <span className="text-[10px] text-gray-400 font-medium">
                            {format(endDate, 'dd MMM')}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={endInput}
                            onChange={(e) => handleInputChange('endTime', e.target.value, endTime)}
                            placeholder="00:00"
                            className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono placeholder-neutral-600"
                        />
                    </div>
                    <div className="flex bg-neutral-800 rounded-lg border border-neutral-700 p-1 shrink-0">
                        <button
                            onClick={() => getAmPm(endTime) === 'PM' && handleAmPmToggle('endTime', endTime)}
                            className={clsx(
                                "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                                getAmPm(endTime) === 'AM' ? "bg-neutral-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            AM
                        </button>
                        <button
                            onClick={() => getAmPm(endTime) === 'AM' && handleAmPmToggle('endTime', endTime)}
                            className={clsx(
                                "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all",
                                getAmPm(endTime) === 'PM' ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            PM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
