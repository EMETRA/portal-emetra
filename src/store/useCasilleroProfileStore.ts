import { create } from "zustand";
import { fetchMyProfile } from "@/lib/casillero/api";
import type { CasilleroUser } from "@/lib/casillero/types";

type ProfileStore = {
  profile: CasilleroUser | null;
  load: () => Promise<CasilleroUser>;
  refresh: () => Promise<CasilleroUser>;
  setProfile: (profile: CasilleroUser) => void;
  clear: () => void;
};

let pending: Promise<CasilleroUser> | null = null;
let generation = 0;

export const useCasilleroProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  load: () => {
    const cached = get().profile;
    if (cached) return Promise.resolve(cached);
    if (pending) return pending;

    const requestGeneration = generation;
    const request = fetchMyProfile().then((profile) => {
      if (requestGeneration === generation) set({ profile });
      return profile;
    }).finally(() => {
      if (pending === request) pending = null;
    });
    pending = request;
    return request;
  },
  refresh: () => {
    get().clear();
    return get().load();
  },
  setProfile: (profile) => {
    generation += 1;
    pending = null;
    set({ profile });
  },
  clear: () => {
    generation += 1;
    pending = null;
    set({ profile: null });
  },
}));
