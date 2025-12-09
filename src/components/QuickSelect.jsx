import React from 'react';
import { subDays, subMonths, subYears, startOfDay, endOfDay, startOfYesterday, endOfYesterday } from 'date-fns';
import { clsx } from 'clsx';

export const QuickSelect = ({ currentRange, onSelect }) => {
    const options = [
        { label: 'Today', getValue: () => ({ startDate: startOfDay(new Date()), endDate: endOfDay(new Date()) }) },
        { label: 'Yesterday', getValue: () => ({ startDate: startOfYesterday(), endDate: endOfYesterday() }) },
        { label: 'Past 7 Days', getValue: () => ({ startDate: subDays(new Date(), 7), endDate: new Date() }) },
        { label: 'Past 30 Days', getValue: () => ({ startDate: subDays(new Date(), 30), endDate: new Date() }) },
        { label: 'Past 6 Months', getValue: () => ({ startDate: subMonths(new Date(), 6), endDate: new Date() }) },
        { label: 'Past Year', getValue: () => ({ startDate: subYears(new Date(), 1), endDate: new Date() }) },
    ];

    return (
        <div className="flex flex-col gap-1">
            {options.map((option) => (
                <button
                    key={option.label}
                    onClick={() => onSelect(option.getValue())}
                    className={clsx(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200",
                        "hover:bg-neutral-800 text-gray-400 hover:text-white",
                        // You could add active state logic here if needed, but for now simple hover is good
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};
