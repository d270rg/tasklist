"use client";

import { useEffect, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isSameDay,
  isToday,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import styles from "./widgets.module.css";

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar({
  value,
  onSelect,
  maxDate,
}: {
  value?: Date;
  onSelect: (day: Date) => void;
  maxDate?: Date;
}) {
  const [viewDate, setViewDate] = useState(() => value ?? new Date());

  const monthStart = startOfMonth(viewDate);
  const days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(viewDate),
  });
  const leadingBlanks = monthStart.getDay();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          aria-label="Previous month"
        >
          {"<"}
        </button>
        <div className="fw-semibold">{format(viewDate, "MMMM yyyy")}</div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          aria-label="Next month"
        >
          {">"}
        </button>
      </div>

      <div className={`d-grid ${styles.datePickerGrid}`}>
        {weekDays.map((weekDay) => (
          <div
            key={weekDay}
            className={`text-center small text-muted ${styles.datePickerWeekday}`}
          >
            {weekDay}
          </div>
        ))}

        {Array.from({ length: leadingBlanks }, (_, index) => (
          <div key={`blank-${index}`} />
        ))}

        {days.map((day) => {
          const selected = value ? isSameDay(day, value) : false;
          const outOfRange =
            maxDate !== undefined &&
            isAfter(startOfDay(day), startOfDay(maxDate));
          let dayClass = "btn-light";
          if (selected) {
            dayClass = "btn-primary";
          } else if (isToday(day)) {
            dayClass = "btn-outline-primary";
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={`btn btn-sm border-0 p-0 ${dayClass} ${styles.datePickerDay}`}
              onClick={() => onSelect(day)}
              disabled={outOfRange}
              aria-pressed={selected}
              aria-label={format(day, "MMMM d, yyyy")}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function DatePicker({
  value,
  onChange,
  maxDate,
  placeholder = "Select date",
  disabled = false,
}: {
  value?: Date;
  onChange: (date: Date) => void;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (disabled) return;
    setOpen(!open);
  }

  function select(day: Date) {
    const selected = startOfDay(day);
    if (value) {
      selected.setHours(
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
        value.getMilliseconds(),
      );
    }
    onChange(selected);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="position-relative d-inline-block">
      <div className="input-group">
        <input
          className="form-control"
          value={value ? format(value, "MMM d, yyyy") : ""}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={toggle}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggle();
            }
          }}
          aria-haspopup="dialog"
          aria-expanded={open}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={toggle}
          disabled={disabled}
          aria-label="Toggle calendar"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          className={`dropdown-menu show p-2 shadow ${styles.datePickerPopup}`}
          role="dialog"
          aria-label="Calendar"
        >
          <Calendar value={value} onSelect={select} maxDate={maxDate} />
        </div>
      )}
    </div>
  );
}
