import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { Banner, Button, Field, s } from "../src/components/ui";
import { authService } from "../src/lib/auth";
import { isEmail } from "../src/lib/validation";
import { colors } from "../src/theme";

export default function SignUp() {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const set = (k: keyof typeof f, v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  async function submit() {
    setNotice(null);
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (!isEmail(f.email)) e.email = "Enter a valid email";
    if (f.password.length < 8) e.password = "Use at least 8 characters";
    if (f.confirm !== f.password) e.confirm = "Passwords don't match";
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    const r = await authService.signUp(f.name, f.email, f.password);
    if (!r.ok) setNotice(r.error);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Image source={require("../assets/images/logo-sejc.png")} style={{ width: 180, height: 96 }} resizeMode="contain" accessibilityLabel="SAC EJC logo" />
          <Text style={[s.h1, { marginTop: 10 }]}>Create your account</Text>
          <Text style={[s.lead, { textAlign: "center", marginBottom: 0 }]}>Join the SAC EJC community</Text>
        </View>
        <Field label="Full Name" placeholder="Your name" value={f.name} onChangeText={(v) => set("name", v)} error={errors.name} />
        <Field label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" value={f.email} onChangeText={(v) => set("email", v)} error={errors.email} />
        <Field label="Password" placeholder="At least 8 characters" secureTextEntry value={f.password} onChangeText={(v) => set("password", v)} error={errors.password} />
        <Field label="Confirm Password" placeholder="Re-enter password" secureTextEntry value={f.confirm} onChangeText={(v) => set("confirm", v)} error={errors.confirm} />
        {notice ? <Banner kind="info" text={notice} /> : null}
        <Button title="Create account" onPress={submit} />
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
          <Text style={{ color: colors.muted }}>Already have an account? </Text>
          <Link href="/login" replace><Text style={{ color: colors.primary, fontWeight: "700" }}>Sign in</Text></Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
