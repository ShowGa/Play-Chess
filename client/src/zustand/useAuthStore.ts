import { create } from "zustand";

type User = {
  userId: string;
  username: string;
};

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

const randomNum = Math.floor(Math.random() * 1000);

const useAuthStore = create<UserState>((set) => ({
  user: { userId: `userId-${randomNum}`, username: `username-${randomNum}` }, // modify => login system
  setUser: (user: User) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export default useAuthStore;
