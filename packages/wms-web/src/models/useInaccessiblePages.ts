import { create } from "zustand";

interface InaccessiblePagesState {
  inaccessiblePages: string[] | null;
  setInaccessiblePages: (inaccessiblePages: string[]) => void;
}

export default create<InaccessiblePagesState>((set) => ({
  inaccessiblePages: null,
  setInaccessiblePages(inaccessiblePages: string[]) {
    set({ inaccessiblePages });
  },
}));
