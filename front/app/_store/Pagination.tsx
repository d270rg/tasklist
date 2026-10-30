import { create } from "zustand";
import { Sort, SortDirection } from "../_models/Query";
import { Task } from "../_models/Task";

interface State {
  start: number;
  limit: number;
  sort: Sort;
  setLimits: (start: number, limit: number) => void;
  setSortField: (field: keyof Task) => void;
  setSortDirection: (direction: SortDirection) => void;
}

export const useTaskPage = create<State>()((set) => ({
  start: 0,
  limit: 10,
  sort: {
    field: "priority",
    direction: SortDirection.Asc,
  },
  setLimits: (start: number, limit: number) => set({ start, limit }),
  setSortField: (field: keyof Task) =>
    set({ sort: { ...useTaskPage.getState().sort, field } }),
  setSortDirection: (direction: SortDirection) =>
    set({ sort: { ...useTaskPage.getState().sort, direction } }),
}));
