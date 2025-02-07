import { create } from 'zustand';

type OpenCategoryState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id?: string | null) => void;
  onClose: () => void;
};

export const useOpenCategory = create<OpenCategoryState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id?: string | undefined | null) => set({ isOpen: true, id: id || undefined }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
