import { useEffect, useState } from "react";
import { Task } from "../_models/Task";
import { DateTimePicker } from "./lib/dateTimePicker";
import { Counter } from "./lib/counter";
import { Mode } from "../_store/Modal";

interface ValidationResult<T> {
  value: T;
  error?: string;
}

type Validator<T> = (value: T | undefined) => ValidationResult<T> | undefined;

function validateTitle(title: string | undefined) {
  if (title === undefined) {
    return { value: title, error: "Title should not be undefined" };
  }
  if (title.length === 0) {
    return { value: title, error: "Title should be longer than 0 symbols" };
  }

  return { value: title };
}

function validateDeadline(deadline: Date | undefined) {
  if (deadline === undefined) {
    return { value: deadline, error: "Deadline is empty" };
  }

  const time = deadline.getTime();
  if (time <= Date.now()) {
    return { value: deadline, error: "Deadline can't be in the past" };
  }

  return { value: deadline };
}

const validators: Partial<
  Record<keyof Task, (value: any) => ValidationResult<any>>
> = {
  title: validateTitle,
  deadline: validateDeadline,
};

function mapDataToModels(initialData: Partial<Task> | undefined) {
  if (initialData === undefined) {
    return {};
  }

  const models: Record<string, ValidationResult<unknown>> = {};
  for (const [key, value] of Object.entries(initialData)) {
    const validator = validators[key as keyof Task];
    if (validator !== undefined) {
      models[key] = validator(value);
    } else {
      models[key] = { value };
    }
  }
  return models;
}

function mapModelsToData(
  formData: Record<string, ValidationResult<unknown>>,
): Task {
  let data: Record<string, any> = {};
  for (const [key, validation] of Object.entries(formData)) {
    if (validation.error) {
      throw new Error("Error during final validation");
    }
    data[key] = validation.value;
  }

  return data as Task;
}

function validate(key: keyof Task, value: any) {
  if (validators[key] === undefined) {
    return { value };
  }
  return validators[key](value);
}

export function EditModal({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: Partial<Task> | undefined;
  onSave: (data: Task) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Record<string, ValidationResult<unknown>>>(
    {},
  );

  useEffect(() => {
    setForm(mapDataToModels(initialData));
  }, [initialData]);

  const title = form["title"]?.value as string | undefined;
  const deadline = form["deadline"]?.value as Date | undefined;
  const priority = (form["priority"]?.value ?? 0) as number | undefined;

  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <div className="d-flex flex-column">
        <div className="pb-1">Title:</div>
        <input
          className="form-control"
          placeholder="Title"
          value={title ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: validate("title", e.target.value),
            }))
          }
        ></input>
        {form["title"]?.error ? (
          <div className="text-danger">{form["title"]?.error}</div>
        ) : null}
      </div>
      <div className="d-flex flex-column">
        <div className="pb-1">Deadline:</div>
        <DateTimePicker
          value={deadline}
          onChange={(nextDeadline) => {
            setForm((prev) => ({
              ...prev,
              deadline: validate("deadline", nextDeadline),
            }));
          }}
        ></DateTimePicker>
        {form["deadline"]?.error ? (
          <div className="text-danger">{form["deadline"]?.error}</div>
        ) : null}
      </div>
      <div className="d-flex flex-row justify-content-between align-items-center">
        Priority:
        <Counter
          value={priority}
          onChange={(nextPriority) =>
            setForm((prev) => ({
              ...prev,
              priority: validate("priority", nextPriority),
            }))
          }
        ></Counter>
      </div>
      <div className="d-flex justify-content-between w-100">
        <button
          className="btn btn-outline-secondary btn-hover-success"
          disabled={!!form["title"]?.error || !!form["deadline"]?.error}
          onClick={() => onSave(mapModelsToData(form))}
        >
          {initialData ? "Save" : "Add"}
        </button>
        <button
          className="btn btn-outline-secondary btn-hover-cancel"
          onClick={() => onCancel()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
