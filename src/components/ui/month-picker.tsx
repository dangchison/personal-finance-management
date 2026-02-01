"use client";

import * as React from "react";
import { setMonth, setYear, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface MonthPickerProps {
    date?: Date;
    onDateChange: (range: { from: Date; to: Date }) => void;
    className?: string;
    align?: "center" | "start" | "end";
}

const MONTHS_SHORT = [
    "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
    "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"
];

const MONTHS_FULL = [
    "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
    "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"
];

export function MonthPicker({ date, onDateChange, className, align = "start" }: MonthPickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Initialize with provided date or current date
    const initialDate = date || new Date();
    const [selectedMonth, setSelectedMonth] = React.useState(initialDate.getMonth());
    const [selectedYear, setSelectedYear] = React.useState(initialDate.getFullYear());

    // Update local state when prop changes
    React.useEffect(() => {
        if (date) {
            setSelectedMonth(date.getMonth());
            setSelectedYear(date.getFullYear());
        }
    }, [date]);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const handleYearChange = (direction: 'prev' | 'next') => {
        if (direction === 'next' && selectedYear >= currentYear) return;
        setSelectedYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
    };

    const handleMonthSelect = (monthIndex: number) => {
        // Prevent future selection
        if (selectedYear === currentYear && monthIndex > currentMonth) return;

        const newDate = setYear(setMonth(new Date(), monthIndex), selectedYear);
        const from = startOfMonth(newDate);
        const to = endOfMonth(newDate);

        setSelectedMonth(monthIndex);
        onDateChange({ from, to });
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        <span>
                            {MONTHS_FULL[date.getMonth()]} {date.getFullYear()}
                        </span>
                    ) : (
                        <span>Chọn tháng</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align={align}>
                {/* Header Year Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleYearChange('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-semibold text-sm">{selectedYear}</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleYearChange('next')}
                        disabled={selectedYear >= currentYear}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Months Grid */}
                <div className="grid grid-cols-4 gap-2">
                    {MONTHS_SHORT.map((month, index) => {
                        const isFuture = selectedYear === currentYear && index > currentMonth;
                        const isSelected = selectedMonth === index && selectedYear === (date?.getFullYear() || selectedYear);

                        return (
                            <button
                                key={index}
                                onClick={() => handleMonthSelect(index)}
                                disabled={isFuture}
                                className={cn(
                                    "h-10 rounded-md text-sm font-medium transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background",
                                    isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-background"
                                )}
                            >
                                {month}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
