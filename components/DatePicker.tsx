"use client";

import { useId, useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
    id: string;
    name: string;
    required?: boolean;
    defaultValue?: string;
}

export function DatePicker({ id, name, required = false, defaultValue = "" }: DatePickerProps) {
    const popoverId = useId();
    const [selected, setSelected] = useState<Date | undefined>();
    const [inputValue, setInputValue] = useState(defaultValue);
    const [isPopperOpen, setIsPopperOpen] = useState(false);

    // Manage popover closing on outside click
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsPopperOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const returnFocusToInput = () => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    const handleDaySelect = (date: Date | undefined) => {
        setSelected(date);
        if (date) {
            setInputValue(format(date, "MMM d, yyyy"));
            setIsPopperOpen(false);
            returnFocusToInput();
        } else {
            setInputValue("");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setIsPopperOpen(false);
            returnFocusToInput();
            return;
        }

        if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
            event.preventDefault();
            setIsPopperOpen(true);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    id={id}
                    name={name}
                    required={required}
                    value={inputValue}
                    readOnly
                    onClick={() => setIsPopperOpen(!isPopperOpen)}
                    onKeyDown={handleKeyDown}
                    aria-expanded={isPopperOpen}
                    aria-haspopup="dialog"
                    aria-controls={popoverId}
                    ref={inputRef}
                    className="h-10 w-full rounded border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm transition-all outline-none cursor-pointer pr-10 placeholder:text-[var(--color-ink-muted)] hover:border-[var(--color-ink-faint)] focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)]"
                    placeholder="Select a date..."
                    autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] pointer-events-none">
                    <CalendarIcon size={16} />
                </div>
            </div>

            {isPopperOpen && (
                <div
                    id={popoverId}
                    role="dialog"
                    aria-label="Choose date"
                    className="absolute z-50 mt-2 bg-white rounded-lg border border-[var(--color-border)] shadow-lg p-2 animate-fade-in"
                >
                    <DayPicker
                        initialFocus
                        mode="single"
                        selected={selected}
                        onSelect={handleDaySelect}
                        showOutsideDays
                        components={{
                            Chevron: ({ orientation }) => (
                                orientation === "left"
                                    ? <ChevronLeft size={16} className="text-[#1a1a1a]" />
                                    : <ChevronRight size={16} className="text-[#1a1a1a]" />
                            ),
                        }}
                        modifiersStyles={{
                            selected: {
                                backgroundColor: "#1a1a1a",
                                color: "white",
                                borderRadius: "9999px"
                            },
                            today: {
                                fontWeight: "bold",
                                color: "#1a1a1a"
                            },
                        }}
                        styles={{
                            head_cell: { color: "var(--color-ink-muted)", fontSize: "0.75rem", fontWeight: 500 },
                            cell: { fontSize: "0.8125rem" },
                            day: { fontSize: "0.8125rem" },
                            caption_label: { fontSize: "0.875rem", fontWeight: 600 },
                        }}
                    />
                </div>
            )}
        </div>
    );
}
