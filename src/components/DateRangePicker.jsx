import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { QuickSelect } from './QuickSelect';
import { Calendar } from './Calendar';
import { TimePicker } from './TimePicker';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const DateRangePicker = ({ range, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempRange, setTempRange] = useState(range);
    const containerRef = useRef(null);

    useEffect(() => {
        setTempRange(range);
    }, [range, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleApply = () => {
        onChange(tempRange);
        setIsOpen(false);
    };

    const handleClear = () => {
        const now = new Date();
        const resetRange = {
            startDate: now,
            endDate: now,
            startTime: '00:00',
            endTime: '23:59'
        };
        setTempRange(resetRange);
        onChange(resetRange);
    };

    const formatDateDisplay = (date, time) => {
        if (!date) return 'Please select';
        if (time) return (
            <span className="flex items-center gap-1">
                <span className="font-semibold text-gray-200">{format(date, 'dd MMM yyyy')}</span>
                <span className="text-gray-400 text-xs">{time}</span>
            </span>
        );
        return <span className="font-semibold text-gray-200">{format(date, 'dd MMM yyyy')}</span>;
    };

    return (
        <div className="relative w-full max-w-xl" ref={containerRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge(
                    "flex items-center justify-between w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl hover:border-orange-500 transition-all duration-200 group shadow-sm",
                    isOpen && "border-orange-500 ring-1 ring-orange-500 shadow-orange-500/10"
                )}
            >
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-2.5 bg-neutral-800 rounded-lg group-hover:bg-neutral-700 transition-colors shrink-0">
                        <CalendarIcon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-0.5">Date Range</span>
                        <div className="flex items-center gap-2 text-sm truncate w-full">
                            {formatDateDisplay(range.startDate, range.startTime)}
                            <span className="text-gray-600">-</span>
                            {formatDateDisplay(range.endDate, range.endTime)}
                        </div>
                    </div>
                </div>
                <ChevronDown className={clsx("w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-2", isOpen && "transform rotate-180")} />
            </button>

            {/* Popover */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 mt-2 w-full md:w-auto md:min-w-[900px] max-w-[95vw] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row">

                    {/* Sidebar - Quick Select */}
                    <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-900/50 p-3 overflow-x-auto md:overflow-visible flex md:block gap-2 md:gap-0">
                        <QuickSelect
                            currentRange={tempRange}
                            onSelect={(newRange) => setTempRange(prev => ({ ...prev, ...newRange }))}
                        />
                    </div>

                    <div className="flex-1 flex flex-col">
                        {/* Main Content */}
                        <div className="p-6 flex-1 overflow-y-auto max-h-[70vh] md:max-h-none">
                            {/* Date Inputs Display */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex-1 bg-neutral-800 rounded-xl p-4 border border-neutral-700/50">
                                    <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">From</span>
                                    <span className="block text-xl font-medium text-orange-500">
                                        {tempRange.startDate ? format(tempRange.startDate, 'dd MMM yyyy') : 'Select Date'}
                                    </span>
                                </div>
                                <div className="flex-1 bg-neutral-800 rounded-xl p-4 border border-neutral-700/50">
                                    <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">To</span>
                                    <span className="block text-xl font-medium text-gray-300">
                                        {tempRange.endDate ? format(tempRange.endDate, 'dd MMM yyyy') : 'Select Date'}
                                    </span>
                                </div>
                            </div>

                            {/* Calendar & Time */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1">
                                    <Calendar
                                        startDate={tempRange.startDate}
                                        endDate={tempRange.endDate}
                                        onChange={(start, end) => setTempRange(prev => ({ ...prev, startDate: start, endDate: end }))}
                                    />
                                </div>
                                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-6 lg:pt-0 lg:pl-8">
                                    <TimePicker
                                        startDate={tempRange.startDate}
                                        endDate={tempRange.endDate}
                                        startTime={tempRange.startTime}
                                        endTime={tempRange.endTime}
                                        onChange={(type, value) => setTempRange(prev => ({ ...prev, [type]: value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end items-center gap-3 p-4 border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-sm">
                            <button
                                onClick={handleClear}
                                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApply}
                                className="px-7 py-2.5 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
