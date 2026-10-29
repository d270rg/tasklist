"use client";

import { useEffect, useState } from "react";
import styles from "./widgets.module.css";

type Meridiem = "AM" | "PM";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function to24Hour(hour: number, meridiem: Meridiem) {
  if (meridiem === "AM") {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
}

function TimeField({
  value,
  min,
  max,
  label,
  disabled = false,
  onChange,
  onAdjust,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  disabled?: boolean;
  onChange: (value: number) => void;
  onAdjust: (offset: number) => number;
}) {
  const [draft, setDraft] = useState(() => pad(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setDraft(pad(value));
    }
  }, [value, focused]);

  function clamp(next: number) {
    return Math.min(max, Math.max(min, next));
  }

  function commit(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    const bounded = Number.isNaN(parsed) ? value : clamp(parsed);
    setDraft(pad(bounded));
    if (bounded !== value) {
      onChange(bounded);
    }
  }

  function adjust(offset: number) {
    setDraft(pad(onAdjust(offset)));
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={() => adjust(1)}
        disabled={disabled}
        aria-label={`Increase ${label}`}
      >
        {"\u25B2"}
      </button>
      <input
        className={`form-control form-control-sm text-center ${styles.timePickerField}`}
        type="text"
        inputMode="numeric"
        value={draft}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit(draft);
        }}
        onChange={(event) => {
          const raw = event.target.value.replace(/\D/g, "").slice(0, 2);
          setDraft(raw);
          if (raw === "") return;
          const parsed = Number.parseInt(raw, 10);
          if (Number.isNaN(parsed)) return;
          const bounded = clamp(parsed);
          if (bounded !== value) {
            onChange(bounded);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            adjust(1);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            adjust(-1);
          }
        }}
        aria-label={label}
      />
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={() => adjust(-1)}
        disabled={disabled}
        aria-label={`Decrease ${label}`}
      >
        {"\u25BC"}
      </button>
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}) {
  const hour24 = value.getHours();
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minute = value.getMinutes();
  const meridiem: Meridiem = hour24 < 12 ? "AM" : "PM";

  function updateTime(hours: number, minutes: number) {
    const next = new Date(value);
    next.setHours(hours, minutes, 0, 0);
    onChange(next);
  }

  function shiftHours(offset: number) {
    const next = (hour24 + offset + 24) % 24;
    updateTime(next, minute);
    return next % 12 === 0 ? 12 : next % 12;
  }

  function shiftMinutes(offset: number) {
    const next = (minute + offset + 60) % 60;
    updateTime(hour24, next);
    return next;
  }

  return (
    <div className="d-flex align-items-start gap-1">
      <TimeField
        value={hour12}
        min={1}
        max={12}
        label="Hours"
        disabled={disabled}
        onChange={(hours) => updateTime(to24Hour(hours, meridiem), minute)}
        onAdjust={shiftHours}
      />

      <span className="pt-2">:</span>

      <TimeField
        value={minute}
        min={0}
        max={59}
        label="Minutes"
        disabled={disabled}
        onChange={(minutes) => updateTime(hour24, minutes)}
        onAdjust={shiftMinutes}
      />

      <div
        className="btn-group-vertical ms-1"
        role="group"
        aria-label="AM or PM"
      >
        <button
          type="button"
          className={`btn btn-sm ${
            meridiem === "AM" ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() => updateTime(to24Hour(hour12, "AM"), minute)}
          disabled={disabled}
          aria-pressed={meridiem === "AM"}
        >
          AM
        </button>
        <button
          type="button"
          className={`btn btn-sm ${
            meridiem === "PM" ? "btn-primary" : "btn-outline-secondary"
          }`}
          onClick={() => updateTime(to24Hour(hour12, "PM"), minute)}
          disabled={disabled}
          aria-pressed={meridiem === "PM"}
        >
          PM
        </button>
      </div>
    </div>
  );
}
