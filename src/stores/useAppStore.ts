import { create } from 'zustand';

import type { AppMode } from '@/types';

interface AppStoreState {
  mode: AppMode;
  panelOpen: boolean;
  searchQuery: string;
  isSearchFocused: boolean;
  setMode: (mode: AppMode) => void;
  setPanelOpen: (panelOpen: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
  setSearchFocused: (isSearchFocused: boolean) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  mode: 'route',
  panelOpen: true,
  searchQuery: '',
  isSearchFocused: false,
  setMode: (mode) => {
    set({ mode });
  },
  setPanelOpen: (panelOpen) => {
    set({ panelOpen });
  },
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
  },
  setSearchFocused: (isSearchFocused) => {
    set({ isSearchFocused });
  },
}));
