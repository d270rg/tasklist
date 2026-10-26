import z from "zod";
import { Pagination } from "./_models/Query";
import { task, Task } from "./_models/Task";

export const baseUrl = "http://localhost:5298";

export async function getPage({ pagination }: { pagination: Pagination }) {
  const response = await fetch(new URL("/tasks/page", baseUrl), {
    method: "POST",
    body: JSON.stringify({ pagination }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  const parsedResponse = z.safeParse(z.array(task), json);

  if (parsedResponse.error) {
    console.log("GetPage error:", parsedResponse.error.issues);
  }

  return parsedResponse.data;
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

  const parsedResponse = z.safeParse(z.string(), json);

  if (parsedResponse.error) {
    console.log("GetPage error:", parsedResponse.error.issues);
  }

  return parsedResponse.data;
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

  const parsedResponse = z.safeParse(task, json);

  if (parsedResponse.error) {
    console.log("GetPage error:", parsedResponse.error.issues);
  }

  return parsedResponse.data;
}

export async function deleteTask(id: string) {
  await fetch(new URL(`/tasks/${id}`, baseUrl), {
    method: "DELETE",
  });
}
