import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Realm = 'sakura' | 'dragon';

interface ThemeState {
    realm: Realm;
    toggleRealm: () => void;
    setRealm: (realm: Realm) => void;
}

export function useThemeStore(): ThemeState {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default to 'sakura' (light) during SSR to match initial HTML
    if (!mounted) {
        return {
            realm: 'sakura',
            toggleRealm: () => { },
            setRealm: () => { },
        };
    }

    const realm: Realm = resolvedTheme === 'dark' ? 'dragon' : 'sakura';

    const toggleRealm = () => {
        setTheme(realm === 'sakura' ? 'dark' : 'light');
    };

    const setRealm = (newRealm: Realm) => {
        setTheme(newRealm === 'dragon' ? 'dark' : 'light');
    };

    return {
        realm,
        toggleRealm,
        setRealm,
    };
}
