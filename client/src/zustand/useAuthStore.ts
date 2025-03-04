import { create } from "zustand";

type User = {
  userId: number;
  username: string;
};

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

const useAuthStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export default useAuthStore;
