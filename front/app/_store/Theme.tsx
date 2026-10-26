import { create } from "zustand";

enum Theme {
  Light = "Light",
  Dark = "Dark",
  Default = "Default",
}

interface State {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<State>()((set) => ({
  theme: Theme.Default,
  setTheme: (theme: Theme) =>
    set({
      theme,
    }),
}));
