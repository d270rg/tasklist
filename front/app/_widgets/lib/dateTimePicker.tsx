"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./datePicker";
import { TimePicker } from "./timePicker";
import styles from "./widgets.module.css";

export function DateTimePicker({
  value,
  onChange,
  maxDate,
  placeholder = "Select date & time",
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
  const timeValue = value ?? new Date();

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
    const selected = new Date(day);
    selected.setHours(
      timeValue.getHours(),
      timeValue.getMinutes(),
      0,
      0,
    );
    onChange(selected);
  }

  return (
    <div ref={rootRef} className="position-relative d-inline-block">
      <div className="input-group">
        <input
          className="form-control"
          value={value ? format(value, "MMM d, yyyy h:mm a") : ""}
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
          aria-label="Toggle date and time picker"
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
          className={`dropdown-menu show p-2 shadow ${styles.dateTimePickerPopup}`}
          role="dialog"
          aria-label="Date and time"
        >
          <Calendar value={value} onSelect={select} maxDate={maxDate} />
          <hr className="my-2" />
          <TimePicker value={timeValue} onChange={onChange} disabled={disabled} />
          <div className="d-flex justify-content-end mt-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
