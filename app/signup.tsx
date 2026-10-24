import { useState } from "react";
import { Image, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { FormScreen } from "../src/components/form-screen";
import { Banner, Button, PrivacyLink, Field } from "../src/components/ui";
import { authService } from "../src/lib/auth";
import { useTheme } from "../src/lib/theme";
import { isEmail } from "../src/lib/validation";

const empty = { firstName: "", lastName: "", email: "", password: "", confirm: "" };

export default function SignUp() {
  const { colors, s } = useTheme();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);
  const set = (k: keyof typeof f, v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  async function submit() {
    setNotice(null);
    const e: Record<string, string> = {};
    if (!f.firstName.trim()) e.firstName = "First name is required";
    if (!f.lastName.trim()) e.lastName = "Last name is required";
    if (!isEmail(f.email)) e.email = "Enter a valid email";
    if (f.password.length < 8) e.password = "Use at least 8 characters";
    if (f.confirm !== f.password) e.confirm = "Passwords don't match";
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setBusy(true); const r = await authService.signUp(f.firstName, f.lastName, f.email, f.password); setBusy(false);
    if (!r.ok) setNotice({ kind: r.notAvailable ? "info" : "error", text: r.error });
    else if (r.needsConfirmation) { setNotice({ kind: "success", text: r.message ?? "Check your email to confirm your account." }); setF(empty); }
    else router.replace("/account");
  }

  return (
    <FormScreen>
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <Image source={require("../assets/images/logo-sejc.png")} style={{ width: 180, height: 96 }} resizeMode="contain" accessibilityLabel="SAC EJC logo" />
        <Text style={[s.h1, { marginTop: 10 }]}>Create your account</Text>
        <Text style={[s.lead, { textAlign: "center", marginBottom: 0 }]}>Join the SAC EJC community</Text>
      </View>
      <Field label="First name" required placeholder="Your first name" autoComplete="given-name" textContentType="givenName" value={f.firstName} onChangeText={(v) => set("firstName", v)} error={errors.firstName} />
      <Field label="Last name" required placeholder="Your last name" autoComplete="family-name" textContentType="familyName" value={f.lastName} onChangeText={(v) => set("lastName", v)} error={errors.lastName} />
      <Field label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={f.email} onChangeText={(v) => set("email", v)} error={errors.email} />
      <Field label="Password" placeholder="At least 8 characters" secureTextEntry value={f.password} onChangeText={(v) => set("password", v)} error={errors.password} />
      <Field label="Confirm Password" placeholder="Re-enter password" secureTextEntry value={f.confirm} onChangeText={(v) => set("confirm", v)} error={errors.confirm} />
      {notice ? <Banner kind={notice.kind} text={notice.text} /> : null}
      <Button title={busy ? "Creating account…" : "Create account"} onPress={submit} disabled={busy} />
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
        <Text style={{ color: colors.muted }}>Already have an account? </Text>
        <Link href="/login" replace><Text style={{ color: colors.primary, fontWeight: "700" }}>Sign in</Text></Link>
      </View>
      <PrivacyLink style={{ marginTop: 18 }} />
    </FormScreen>
  );
}
