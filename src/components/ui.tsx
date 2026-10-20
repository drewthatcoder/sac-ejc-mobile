import React from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { Linking } from "react-native";
import { colors } from "../theme";
import { OFFLINE_NO_ALTERNATIVE, OFFLINE_NOTICE, ORG_CONTACT_EMAIL } from "../content";

export function Field({ label, required, error, ...props }: TextInputProps & { label: string; required?: boolean; error?: string }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}{required ? <Text style={{ color: colors.error }}> *</Text> : null}</Text>
      <TextInput placeholderTextColor="#98a29b" style={[s.input, props.multiline && s.multi, error ? { borderColor: colors.error } : null]} accessibilityLabel={label} {...props} />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

export function Button({ title, onPress, disabled, style, variant = "primary" }: { title: string; onPress: () => void; disabled?: boolean; style?: ViewStyle; variant?: "primary" | "outline" }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}
      style={({ pressed }) => [s.btn, variant === "outline" && s.outline, { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      <Text style={[s.btnText, variant === "outline" && { color: colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

export function Banner({ kind, text }: { kind: "success" | "info" | "error"; text: string }) {
  const bg = kind === "success" ? "#e3f3e8" : kind === "info" ? "#fff4df" : "#fbe5e2";
  return <View style={[s.banner, { backgroundColor: bg }]}><Text style={s.bannerText}>{text}</Text></View>;
}

export const s = StyleSheet.create({
  screen: { padding: 20, paddingBottom: 48, backgroundColor: colors.bg },
  h1: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 6 },
  lead: { fontSize: 16, color: colors.muted, marginBottom: 20, lineHeight: 22 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  field: { marginBottom: 14 },
  label: { fontWeight: "600", color: colors.text, marginBottom: 6, fontSize: 15 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, backgroundColor: "#fff", color: colors.text },
  multi: { minHeight: 110, textAlignVertical: "top" },
  error: { color: colors.error, marginTop: 4, fontSize: 13 },
  btn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  outline: { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.primary },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  banner: { borderRadius: 10, padding: 14, marginBottom: 14 },
  bannerText: { color: colors.text, fontSize: 15, lineHeight: 21 },
});

/** Shown when no backend is configured. Offers a mailto: fallback only if a real org email exists. */
export function OfflineNotice({ afterSubmit, subject, body }: { afterSubmit?: boolean; subject: string; body: string }) {
  const mailto = ORG_CONTACT_EMAIL
    ? `mailto:${ORG_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : null;
  return (
    <View style={[s.banner, { backgroundColor: "#fff4df", borderWidth: 1, borderColor: colors.accent }]} accessibilityRole="alert">
      <Text style={[s.bannerText, { fontWeight: "700", marginBottom: 4 }]}>{afterSubmit ? "Your form looks good, but it wasn't sent." : "Heads up"}</Text>
      <Text style={s.bannerText}>{OFFLINE_NOTICE}</Text>
      {mailto ? (
        <>
          <Text style={[s.bannerText, { marginTop: 6 }]}>You can email us your message instead:</Text>
          <Button title={`Email ${ORG_CONTACT_EMAIL}`} variant="outline" style={{ marginTop: 10 }} onPress={() => Linking.openURL(mailto)} />
        </>
      ) : (
        <Text style={[s.bannerText, { marginTop: 6 }]}>{OFFLINE_NO_ALTERNATIVE}</Text>
      )}
    </View>
  );
}
