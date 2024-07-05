import { create } from "zustand";
import { createContext } from "react";

export const userContext = createContext([]);

export const sessionContext = createContext([]);

export const groupsContext = createContext([]);

export const housesContext = createContext([]);

export const activitiesContext = createContext([]);

export const useStore = create((set) => ({
  groups: [], // Initial state can be an empty array or some default value
  setGroups: (groups) => set({ groups }), // Action to update groups
}));
