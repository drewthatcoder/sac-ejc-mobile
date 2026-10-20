import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { CONTACT_FIELDS } from "../src/content";
import { Banner, Button, Field, s } from "../src/components/ui";
import { insertRow } from "../src/lib/supabase";
import { ContactForm, validateContact } from "../src/lib/validation";

const empty: ContactForm = { name: "", email: "", phone: "", subject: "", message: "" };
const kb = { email: "email-address", tel: "phone-pad", text: "default" } as const;

export default function Contact() {
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<ReturnType<typeof validateContact>>({});
  const [status, setStatus] = useState<{ kind: "success" | "info" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof ContactForm, v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  async function submit() {
    setStatus(null);
    const e = validateContact(f); setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const r = await insertRow("contact_submissions", { name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), subject: f.subject.trim(), message: f.message.trim() });
    setBusy(false);
    if (r.ok) { setStatus({ kind: "success", text: "Thanks! Your message was sent. We'll get back to you soon." }); setF(empty); }
    else setStatus({ kind: r.notConnected ? "info" : "error", text: r.notConnected ? r.error : `Something went wrong: ${r.error}` });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
        <Text style={s.h1}>Contact Us</Text>
        <Text style={s.lead}>Have a question or want to get involved? Send us a message.</Text>
        {CONTACT_FIELDS.map((c) => (
          <Field key={c.id} label={c.label} required placeholder={c.placeholder} value={f[c.id]} onChangeText={(v) => set(c.id, v)}
            keyboardType={kb[c.type]} autoCapitalize={c.type === "email" ? "none" : "sentences"} error={errors[c.id]} />
        ))}
        <Field label="Message" required multiline placeholder="How can we help?" value={f.message} onChangeText={(v) => set("message", v)} error={errors.message} />
        {status ? <Banner kind={status.kind} text={status.text} /> : null}
        <Button title={busy ? "Sending…" : "Send Message"} onPress={submit} disabled={busy} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
