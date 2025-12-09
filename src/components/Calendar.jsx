import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    isBefore,
    isAfter,
    startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const Calendar = ({ startDate, endDate, onChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const onDateClick = (day) => {
        if (!startDate || (startDate && endDate)) {
            // Start new selection
            onChange(day, null);
        } else if (startDate && !endDate) {
            // Complete selection
            if (isBefore(day, startDate)) {
                onChange(day, startDate);
            } else {
                onChange(startDate, day);
            }
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-orange-500 font-medium text-sm">
                    {format(currentMonth, 'MMMM yyyy')}
                </span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-neutral-800 rounded-full text-orange-500 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-neutral-800 rounded-full text-orange-500 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDateCalendar = startOfWeek(monthStart);
        const endDateCalendar = endOfWeek(monthEnd);

        const calendarDays = eachDayOfInterval({
            start: startDateCalendar,
            end: endDateCalendar
        });

        const rows = [];
        let days = [];

        calendarDays.forEach((day, index) => {
            const formattedDate = format(day, 'd');

            // Reset time to ensure consistent comparison
            const dayStart = startOfDay(day);
            const selStart = startDate ? startOfDay(startDate) : null;
            const selEnd = endDate ? startOfDay(endDate) : null;

            const isSelectedStart = selStart && isSameDay(dayStart, selStart);
            const isSelectedEnd = selEnd && isSameDay(dayStart, selEnd);
            const isInRange = selStart && selEnd && isWithinInterval(dayStart, { start: selStart, end: selEnd });
            const isCurrentMonth = isSameMonth(day, monthStart);

            days.push(
                <div
                    key={day.toString()}
                    className={clsx(
                        "relative h-9 w-9 flex items-center justify-center cursor-pointer text-sm transition-all duration-200 z-10",
                        !isCurrentMonth && "text-neutral-600",
                        isCurrentMonth && !isSelectedStart && !isSelectedEnd && !isInRange && "text-gray-300 hover:bg-neutral-800 hover:text-white rounded-full",
                        (isSelectedStart || isSelectedEnd) && "bg-orange-500 text-white rounded-full shadow-md shadow-orange-500/20",
                        isInRange && !isSelectedStart && !isSelectedEnd && "bg-neutral-800 text-gray-200",
                        // Connect range visually
                        isInRange && !isSelectedStart && "rounded-l-none",
                        isInRange && !isSelectedEnd && "rounded-r-none",
                        isSelectedStart && selEnd && "rounded-r-none",
                        isSelectedEnd && selStart && "rounded-l-none"
                    )}
                    onClick={() => onDateClick(dayStart)}
                >
                    <span className="relative z-10">{formattedDate}</span>
                </div>
            );

            if ((index + 1) % 7 === 0) {
                rows.push(
                    <div className="grid grid-cols-7 gap-y-2 place-items-center" key={day.toString()}>
                        {days}
                    </div>
                );
                days = [];
            }
        });

        return <div className="space-y-2">{rows}</div>;
    };

    return (
        <div className="w-full">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};
