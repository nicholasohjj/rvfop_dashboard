import { create } from "zustand";
import { createContext } from "react";
// Assuming fetchUser is an async function from your services
import { fetchGroups } from "../supabase/services";

export const userContext = createContext([])

export const sessionContext = createContext([])

export const groupsContext = createContext([])

export const housesContext = createContext([])

export const activitiesContext = createContext([])

export const useStore = create((set) => ({
  groups: [], // Initial state can be an empty array or some default value
  setGroups: (groups) => set({ groups }), // Action to update groups
}));

export const initialiseGroups = async () => {
  const groups = await fetchGroups();
  useStore.getState().setGroups(groups);
};


Promise.all([initialiseGroups()]); // Call this function to initialize the userData
