"use client";

import { useState } from "react";
import styles from "./widgets.module.css";

export function Counter({
  value,
  onChange,
  step = 1,
  disabled = false,
  label = "Counter",
}: {
  value?: number;
  onChange?: (value: number) => void;
  step?: number;
  disabled?: boolean;
  label?: string;
}) {
  const [innerValue, setInnerValue] = useState(0);
  const current = value ?? innerValue;
  const increment = Math.max(1, Math.trunc(step));

  function update(next: number) {
    if (next > 10) {
      return;
    }
    setInnerValue(next);
    onChange?.(next);
  }

  return (
    <div className="d-flex align-items-center">
      <input
        className={`text-center ${styles.counterField}`}
        type="number"
        value={current}
        min={0}
        max={10}
        step={increment}
        disabled={disabled}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10);
          if (Number.isNaN(parsed)) return;
          update(parsed);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            update(current + increment);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            update(current - increment);
          }
        }}
        aria-label={label}
      />
      <div className="d-flex flex-column ms-1">
        <button
          type="button"
          className="btn btn-sm secondary-button mb-1"
          onClick={() => update(current + increment)}
          disabled={disabled || current === 10}
          aria-label={`Increase ${label}`}
        >
          {"\u25B2"}
        </button>
        <button
          type="button"
          className="btn btn-sm secondary-button"
          onClick={() => update(current - increment)}
          disabled={disabled || current <= 0}
          aria-label={`Decrease ${label}`}
        >
          {"\u25BC"}
        </button>
      </div>
    </div>
  );
}
