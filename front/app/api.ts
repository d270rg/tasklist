import z from "zod";
import { Pagination } from "./_models/Query";
import { task, Task } from "./_models/Task";

export const baseUrl = "localhost:5298";

export async function getPage(filter: Pagination) {
  const response = await fetch(new URL("/tasks", baseUrl), {
    method: "POST",
    body: JSON.stringify(filter),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  return z.parse(z.array(task), json);
}

export async function getById(id: string) {
  const response = await fetch(new URL(`/tasks/${id}`, baseUrl), {
    method: "GET",
  });
  const json = await response.json();

  return z.parse(task, json);
}

export async function addTask(task: Omit<Task, "id">) {
  const response = await fetch(new URL(`/tasks`, baseUrl), {
    method: "PUT",
    body: JSON.stringify(task),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  return z.parse(z.string(), json);
}

export async function updateTask(
  id: string,
  update: Partial<Omit<Task, "id">>,
) {
  const response = await fetch(new URL(`/tasks/${id}`, baseUrl), {
    method: "PATCH",
    body: JSON.stringify(update),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  return z.parse(task, json);
}

export async function deleteTask(id: string) {
  const response = await fetch(new URL(`/tasks/${id}`, baseUrl), {
    method: "DELETE",
  });
  const json = await response.json();
}
