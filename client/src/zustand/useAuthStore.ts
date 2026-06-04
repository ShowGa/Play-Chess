import { create } from "zustand";

type User = {
  userId: string;
  username: string;
};

interface UserState {
  user: User | null;
  socketId: string | null;
  setUser: (user: User) => void;
  removeUser: () => void;
  setSocketId: (id: string) => void;
}

const randomNum = Math.floor(Math.random() * 1000);

const useAuthStore = create<UserState>((set) => ({
  user: { userId: `userId-${randomNum}`, username: `username-${randomNum}` }, // modify => login system
  socketId: null,

  setUser: (user: User) => set({ user }),
  removeUser: () => set({ user: null }),

  setSocketId: (id: string) => set({ socketId: id }),
}));

export default useAuthStore;
