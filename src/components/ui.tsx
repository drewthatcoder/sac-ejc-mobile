import React, { useEffect, useState, type ReactNode } from "react";
import { Keyboard, Linking, Platform, Pressable, Text, TextInput, TextInputInstance, TextInputProps, View, ViewStyle } from "react-native";
import { KEYBOARD_ACCESSORY_ID, useFieldPlacement, useFormFocus } from "./form-focus";
import { useTheme } from "../lib/theme";
import { OFFLINE_NO_ALTERNATIVE, OFFLINE_NOTICE, ORG_CONTACT_EMAIL, PRIVACY_POLICY_URL } from "../content";

/** Header title that follows the active palette. The navigator default stays near-black in dark mode. */
export function ThemedHeaderTitle({ children }: { children?: ReactNode }) {
  const { colors } = useTheme();
  return <Text accessibilityRole="header" numberOfLines={1} style={{ color: colors.text, fontWeight: "700", fontSize: 17 }}>{children}</Text>;
}

export function Field({
  label, required, error, style, multiline, keyboardType,
  onSubmitEditing, returnKeyType, blurOnSubmit, submitBehavior, inputAccessoryViewID,
  ...props
}: TextInputProps & { label: string; required?: boolean; error?: string }) {
  const { colors, s, scheme } = useTheme();
  const inputRef = React.useRef<TextInputInstance>(null);
  const focusApi = useFormFocus();
  const [fieldId, setFieldId] = useState<number | null>(null);
  useEffect(() => {
    if (!focusApi) return;
    const reg = focusApi.register(() => inputRef.current?.focus());
    setFieldId(reg.id);
    return () => reg.unregister();
  }, [focusApi]);
  const { index, count } = useFieldPlacement(fieldId);
  const inForm = focusApi != null && fieldId != null && index >= 0 && count > 0;
  const isLast = !inForm || index === count - 1;
  const computedReturn = returnKeyType ?? (multiline ? "default" : isLast ? "done" : "next");
  const goNext = !multiline && computedReturn === "next";
  const handleSubmit: NonNullable<TextInputProps["onSubmitEditing"]> = (e) => {
    onSubmitEditing?.(e);
    if (goNext && fieldId != null && focusApi) focusApi.focusNext(fieldId);
    else Keyboard.dismiss();
  };
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}{required ? <Text style={{ color: colors.error }}> *</Text> : null}</Text>
      <TextInput
        ref={inputRef}
        placeholderTextColor={colors.placeholder}
        accessibilityLabel={label}
        keyboardAppearance={scheme === "dark" ? "dark" : "light"}
        {...props}
        multiline={multiline}
        keyboardType={keyboardType}
        inputAccessoryViewID={inputAccessoryViewID ?? (Platform.OS === "ios" ? KEYBOARD_ACCESSORY_ID : undefined)}
        returnKeyType={computedReturn}
        blurOnSubmit={blurOnSubmit ?? (!multiline && !goNext ? true : false)}
        submitBehavior={submitBehavior ?? (multiline ? "newline" : goNext ? "submit" : "blurAndSubmit")}
        onSubmitEditing={multiline ? onSubmitEditing : handleSubmit}
        style={[s.input, multiline && s.multi, error ? { borderColor: colors.error } : null, style]}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

export function Button({ title, onPress, disabled, style, variant = "primary", labelColor }: { title: string; onPress: () => void; disabled?: boolean; style?: ViewStyle; variant?: "primary" | "outline"; labelColor?: string }) {
  const { colors, s } = useTheme();
  const textColor = labelColor ?? (variant === "outline" ? colors.primary : colors.onPrimary);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}
      style={({ pressed }) => [s.btn, variant === "outline" && s.outline, { opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }, style]}>
      <Text style={[s.btnText, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

export function Banner({ kind, text }: { kind: "success" | "info" | "error"; text: string }) {
  const { colors, s } = useTheme();
  const bg = kind === "success" ? colors.successBg : kind === "info" ? colors.infoBg : colors.errorBg;
  return <View style={[s.banner, { backgroundColor: bg }]}><Text style={s.bannerText}>{text}</Text></View>;
}

/** "Email us" fallback with the form contents prefilled; renders nothing if no org email is set. */
export function MailtoFallback({ subject, body }: { subject: string; body: string }) {
  if (!ORG_CONTACT_EMAIL) return null;
  const href = `mailto:${ORG_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return <Button title={`Email us at ${ORG_CONTACT_EMAIL}`} variant="outline" style={{ marginBottom: 14 }} onPress={() => Linking.openURL(href)} />;
}

/** Opens the privacy policy in the system browser. */
export function PrivacyLink({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="link" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} style={[{ alignSelf: "center", padding: 8 }, style]}>
      <Text style={{ color: colors.muted, textDecorationLine: "underline", fontSize: 14 }}>Privacy Policy</Text>
    </Pressable>
  );
}

/** Shown when no backend is configured. Offers a mailto: fallback only if a real org email exists. */
export function OfflineNotice({ afterSubmit, subject, body }: { afterSubmit?: boolean; subject: string; body: string }) {
  const { colors, s } = useTheme();
  const mailto = ORG_CONTACT_EMAIL
    ? `mailto:${ORG_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : null;
  return (
    <View style={[s.banner, { backgroundColor: colors.infoBg, borderWidth: 1, borderColor: colors.accent }]} accessibilityRole="alert">
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
