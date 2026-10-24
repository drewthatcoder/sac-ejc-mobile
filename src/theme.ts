import { StyleSheet } from "react-native";

/** Brand green stays the filled-button color in both themes so white labels keep contrast. */
export type Palette = {
  primary: string;
  primaryButton: string;
  primaryDark: string;
  onPrimary: string;
  bg: string;
  card: string;
  input: string;
  text: string;
  muted: string;
  placeholder: string;
  border: string;
  error: string;
  errorButton: string;
  accent: string;
  onAccent: string;
  successBg: string;
  infoBg: string;
  errorBg: string;
  selectedBg: string;
  keyboardBar: string;
};

export const lightPalette: Palette = {
  primary: "#2f7d4a",
  primaryButton: "#2f7d4a",
  primaryDark: "#1f5a34",
  onPrimary: "#ffffff",
  bg: "#f7f5ef",
  card: "#ffffff",
  input: "#ffffff",
  text: "#1d2a22",
  muted: "#4e5c54",
  placeholder: "#5d6b62",
  border: "#d9ddd6",
  error: "#c0392b",
  errorButton: "#c0392b",
  accent: "#e8a33d",
  onAccent: "#1d2a22",
  successBg: "#e3f3e8",
  infoBg: "#fff4df",
  errorBg: "#fbe5e2",
  selectedBg: "#e3f3e8",
  keyboardBar: "#eef1ee",
};

export const darkPalette: Palette = {
  primary: "#8ed4a8",
  primaryButton: "#2f7d4a",
  primaryDark: "#1f5a34",
  onPrimary: "#ffffff",
  bg: "#101712",
  card: "#1b2620",
  input: "#24302a",
  text: "#f2f7f3",
  muted: "#b7c6bc",
  placeholder: "#a3b5aa",
  border: "#3a4a41",
  error: "#ffb4a8",
  errorButton: "#c0392b",
  accent: "#e8a33d",
  onAccent: "#1d2a22",
  successBg: "#163528",
  infoBg: "#3a3018",
  errorBg: "#3f2422",
  selectedBg: "#1e3f2e",
  keyboardBar: "#1b2620",
};

export type Appearance = "system" | "light" | "dark";
export type ColorScheme = "light" | "dark";

export function paletteFor(scheme: ColorScheme): Palette {
  return scheme === "dark" ? darkPalette : lightPalette;
}

export function createStyles(colors: Palette) {
  return StyleSheet.create({
    screen: { padding: 20, paddingBottom: 48, backgroundColor: colors.bg },
    h1: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 6 },
    lead: { fontSize: 16, color: colors.muted, marginBottom: 20, lineHeight: 22 },
    body: { fontSize: 15, lineHeight: 22, color: colors.text },
    card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
    field: { marginBottom: 14 },
    label: { fontWeight: "600", color: colors.text, marginBottom: 6, fontSize: 15 },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: colors.input, color: colors.text },
    multi: { minHeight: 110, textAlignVertical: "top" },
    error: { color: colors.error, marginTop: 4, fontSize: 13 },
    btn: { backgroundColor: colors.primaryButton, borderRadius: 12, paddingVertical: 15, alignItems: "center" },
    outline: { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.primary },
    btnText: { color: colors.onPrimary, fontWeight: "700", fontSize: 16 },
    banner: { borderRadius: 10, padding: 14, marginBottom: 14 },
    bannerText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  });
}

export type AppStyles = ReturnType<typeof createStyles>;
