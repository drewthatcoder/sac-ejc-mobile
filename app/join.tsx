import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { INTERESTS } from "../src/content";
import { Banner, Button, Field, s } from "../src/components/ui";
import { insertRow } from "../src/lib/supabase";
import { JoinForm, validateJoin } from "../src/lib/validation";
import { colors } from "../src/theme";

const empty: JoinForm = { firstName: "", lastName: "", email: "", phone: "", zip: "", interests: [], message: "" };

export default function Join() {
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<ReturnType<typeof validateJoin>>({});
  const [status, setStatus] = useState<{ kind: "success" | "info" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof JoinForm, v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const toggle = (id: string) => { setF((p) => ({ ...p, interests: p.interests.includes(id) ? p.interests.filter((i) => i !== id) : [...p.interests, id] })); setErrors((e) => ({ ...e, interests: undefined })); };

  async function submit() {
    setStatus(null);
    const e = validateJoin(f); setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const r = await insertRow("join_submissions", {
      first_name: f.firstName.trim(), last_name: f.lastName.trim(), email: f.email.trim(),
      phone: f.phone.trim() || null, zip: f.zip.trim(), interests: f.interests, message: f.message.trim() || null,
    });
    setBusy(false);
    if (r.ok) { setStatus({ kind: "success", text: "Welcome aboard! 🌱 Thanks for joining our cause. We'll be in touch soon!" }); setF(empty); }
    else setStatus({ kind: r.notConnected ? "info" : "error", text: r.notConnected ? r.error : `Something went wrong: ${r.error}` });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
        <Text style={s.h1}>Join Our Cause</Text>
        <Text style={s.lead}>Become part of the movement for environmental justice in Sacramento.</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}><Field label="First Name" required value={f.firstName} onChangeText={(v) => set("firstName", v)} error={errors.firstName} /></View>
          <View style={{ flex: 1 }}><Field label="Last Name" required value={f.lastName} onChangeText={(v) => set("lastName", v)} error={errors.lastName} /></View>
        </View>
        <Field label="Email" required placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={f.email} onChangeText={(v) => set("email", v)} error={errors.email} />
        <Field label="Phone (optional)" placeholder="(916) 555-0123" keyboardType="phone-pad" value={f.phone} onChangeText={(v) => set("phone", v)} error={errors.phone} />
        <Field label="ZIP Code" required placeholder="95814" keyboardType="number-pad" value={f.zip} onChangeText={(v) => set("zip", v)} error={errors.zip} />
        <Text style={s.label}>Areas of Interest <Text style={{ color: colors.error }}>*</Text></Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 6 }}>
          {INTERESTS.map((i) => {
            const on = f.interests.includes(i.id);
            return (
              <Pressable key={i.id} onPress={() => toggle(i.id)} accessibilityRole="checkbox" accessibilityState={{ checked: on }}
                style={{ width: "48%", padding: 12, borderRadius: 12, borderWidth: 2, marginBottom: 10, borderColor: on ? colors.primary : colors.border, backgroundColor: on ? "#e3f3e8" : "#fff" }}>
                <Text style={{ color: on ? colors.text : colors.muted, fontWeight: on ? "700" : "500" }}>{on ? "✓ " : ""}{i.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.interests ? <Text style={[s.error, { marginTop: -4, marginBottom: 10 }]}>{errors.interests}</Text> : null}
        <Field label="Anything else you'd like to share?" multiline placeholder="Tell us about your background, skills, or why you want to help…" value={f.message} onChangeText={(v) => set("message", v)} />
        {status ? <Banner kind={status.kind} text={status.text} /> : null}
        <Button title={busy ? "Submitting…" : "Join the Movement"} onPress={submit} disabled={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
