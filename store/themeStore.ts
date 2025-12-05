import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Realm = 'sakura' | 'dragon';

interface ThemeState {
    realm: Realm;
    toggleRealm: () => void;
    setRealm: (realm: Realm) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            realm: 'sakura', // Default to Light/Sakura
            toggleRealm: () => set((state) => ({ realm: state.realm === 'sakura' ? 'dragon' : 'sakura' })),
            setRealm: (realm) => set({ realm }),
        }),
        {
            name: 'mathforge-theme-storage',
        }
    )
);
