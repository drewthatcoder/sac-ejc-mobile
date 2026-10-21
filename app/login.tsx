import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Banner, Button, Field, s } from "../src/components/ui";
import { authService } from "../src/lib/auth";
import { colors } from "../src/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function signIn() {
    setNotice(null);
    if (!email.trim() || !password) return setNotice({ kind: "error", text: "Enter your email and password." });
    setBusy(true); const r = await authService.signIn(email, password); setBusy(false);
    if (r.ok) router.replace("/account");
    else setNotice({ kind: r.notAvailable ? "info" : "error", text: r.error });
  }
  async function reset() {
    setNotice(null); const r = await authService.resetPassword(email);
    setNotice(r.ok ? { kind: "success", text: r.message ?? "Check your email." } : { kind: r.notAvailable ? "info" : "error", text: r.error });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.screen} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Image source={require("../assets/images/logo-sejc.png")} style={{ width: 180, height: 96 }} resizeMode="contain" accessibilityLabel="SAC EJC logo" />
          <Text style={[s.h1, { marginTop: 10 }]}>Welcome back</Text>
          <Text style={[s.lead, { textAlign: "center", marginBottom: 0 }]}>Sign in to your SAC EJC account</Text>
        </View>
        <Field label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={email} onChangeText={setEmail} />
        <Field label="Password" placeholder="Your password" secureTextEntry autoComplete="password" value={password} onChangeText={setPassword} />
        <Pressable onPress={reset} style={{ alignSelf: "flex-end", marginBottom: 16 }} accessibilityRole="link">
          <Text style={{ color: colors.primary, fontWeight: "600" }}>Forgot password?</Text>
        </Pressable>
        {notice ? <Banner kind={notice.kind} text={notice.text} /> : null}
        <Button title={busy ? "Signing in…" : "Sign In"} onPress={signIn} disabled={busy} />
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
          <Text style={{ color: colors.muted }}>New here? </Text>
          <Link href="/signup" replace><Text style={{ color: colors.primary, fontWeight: "700" }}>Create account</Text></Link>
        </View>
        <Button title="Continue as guest" variant="outline" style={{ marginTop: 22 }} onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
