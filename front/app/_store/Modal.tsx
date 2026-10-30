import { create } from "zustand";
import { Task } from "../_models/Task";

export enum Mode {
  Edit,
  Create,
}

interface State {
  modalData: Task | undefined;
  modalOpened: boolean;
  mode: Mode | undefined;
  setModalData: (modalData: Task | undefined) => void;
  setOpened: (modalOpened: boolean) => void;
  setMode: (mode: Mode) => void;
}

export const useModal = create<State>()((set) => ({
  modalData: undefined,
  modalOpened: false,
  mode: undefined,
  setModalData: (modalData: Task | undefined) =>
    set({
      modalData,
    }),
  setOpened: (modalOpened: boolean) =>
    set({
      modalOpened,
    }),
  setMode: (mode: Mode) =>
    set({
      mode,
    }),
}));
