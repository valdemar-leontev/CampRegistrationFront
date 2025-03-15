import { IDataUser } from '@/models/dto/IDataUser';
import { create } from "zustand";


interface IUserStore {
  user: IDataUser | null;
  setUser: (user: any) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));