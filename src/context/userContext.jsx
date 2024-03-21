import { create } from 'zustand'

// Assuming fetchUser is an async function from your services
import { fetchUser, fetchGroups } from '../supabase/services'

export const useStore = create((set) => ({
  userData: null, // Initial state can be null or some default value
  setUserData: (userData) => set({ userData }), // Action to update userData
  
  groups: [], // Initial state can be an empty array or some default value
  setGroups: (groups) => set({ groups }), // Action to update groups
}));

export const initialiseGroups = async () => {
  const groups = await fetchGroups();
  useStore.getState().setGroups(groups);
};

// Usage example outside the store definition:
export const initializeUserData = async () => {
  const userData = await fetchUser();
  useStore.getState().setUserData(userData);
};

Promise.all([initializeUserData(), initialiseGroups()]); // Call this function to initialize the userData
