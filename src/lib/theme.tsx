import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Platform, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Appearance, ColorScheme, createStyles, paletteFor } from "../theme";

const APPEARANCE_KEY = "appearance";

type ThemeValue = {
  colors: ReturnType<typeof paletteFor>;
  s: ReturnType<typeof createStyles>;
  appearance: Appearance;
  scheme: ColorScheme;
  setAppearance: (next: Appearance) => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

function parseAppearance(value: string | null): Appearance {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [appearance, setAppearanceState] = useState<Appearance>("system");

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(APPEARANCE_KEY).then((value) => {
      if (!cancelled) setAppearanceState(parseAppearance(value));
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next);
    AsyncStorage.setItem(APPEARANCE_KEY, next).catch(() => {});
  }, []);

  const scheme: ColorScheme = appearance === "system" ? (system === "dark" ? "dark" : "light") : appearance;
  const colors = paletteFor(scheme);
  const s = useMemo(() => createStyles(colors), [colors]);
  const value = useMemo(() => ({ colors, s, appearance, scheme, setAppearance }), [colors, s, appearance, scheme, setAppearance]);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    document.documentElement.style.backgroundColor = colors.bg;
    document.body.style.backgroundColor = colors.bg;
    document.documentElement.style.colorScheme = scheme;
  }, [colors.bg, scheme]);

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
