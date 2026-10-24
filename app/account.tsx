import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Banner, Button, Field } from "../src/components/ui";
import { FormScreen } from "../src/components/form-screen";
import { authService, updatePassword, useSession } from "../src/lib/auth";
import { deriveFirstName, deriveLastName } from "../src/lib/name";
import { useTheme } from "../src/lib/theme";
import { isEmail } from "../src/lib/validation";
import type { Session } from "@supabase/supabase-js";

type Notice = { kind: "success" | "info" | "error"; text: string };

/** Signed-in profile editor. Name updates user_metadata and the header chip on the next session event. */
function EditAccountForm({ session, initialMessage }: { session: Session; initialMessage?: string }) {
  const { s } = useTheme();
  const meta = session.user.user_metadata;
  const [firstName, setFirstName] = useState(() => deriveFirstName(meta, session.user.email) ?? "");
  const [lastName, setLastName] = useState(() => deriveLastName(meta) ?? "");
  const [email, setEmail] = useState(session.user.email ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nameError, setNameError] = useState<{ firstName?: string; lastName?: string }>({});
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState<{ password?: string; confirm?: string }>({});
  const [nameNotice, setNameNotice] = useState<Notice | null>(null);
  const [emailNotice, setEmailNotice] = useState<Notice | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<Notice | null>(null);
  const [banner, setBanner] = useState<Notice | null>(initialMessage ? { kind: "success", text: initialMessage } : null);
  const [busy, setBusy] = useState<"name" | "email" | "password" | null>(null);

  async function saveName() {
    setNameNotice(null); setBanner(null);
    const next: typeof nameError = {};
    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    setNameError(next);
    if (next.firstName || next.lastName) return;
    setBusy("name");
    const r = await authService.updateProfile(firstName, lastName);
    setBusy(null);
    setNameNotice(r.ok ? { kind: "success", text: r.message ?? "Your name was updated." } : { kind: r.notAvailable ? "info" : "error", text: r.error });
  }

  async function saveEmail() {
    setEmailNotice(null); setBanner(null);
    if (!isEmail(email)) { setEmailError("Enter a valid email"); return; }
    setEmailError("");
    if (email.trim().toLowerCase() === (session.user.email ?? "").toLowerCase()) {
      setEmailNotice({ kind: "info", text: "That's already the email on this account." });
      return;
    }
    setBusy("email");
    const r = await authService.updateEmail(email);
    setBusy(null);
    setEmailNotice(r.ok ? { kind: "info", text: r.message ?? "We sent a confirmation link. Your email changes after you confirm it." } : { kind: r.notAvailable ? "info" : "error", text: r.error });
  }

  async function savePassword() {
    setPasswordNotice(null); setBanner(null);
    const next: typeof passwordError = {};
    if (password.length < 8) next.password = "Use at least 8 characters";
    if (confirm !== password) next.confirm = "Passwords don't match";
    setPasswordError(next);
    if (next.password || next.confirm) return;
    setBusy("password");
    const r = await updatePassword(password);
    setBusy(null);
    if (!r.ok) { setPasswordNotice({ kind: r.notAvailable ? "info" : "error", text: r.error }); return; }
    setPassword(""); setConfirm("");
    setPasswordNotice({ kind: "success", text: "Your password was updated." });
  }

  return (
    <FormScreen>
      <Text style={s.h1}>Edit account info</Text>
      <Text style={s.lead}>Changes to your name show on the account chip right away. Email changes after you confirm the link.</Text>
      {banner ? <Banner kind={banner.kind} text={banner.text} /> : null}

      <Text style={s.label}>Name</Text>
      <Field label="First name" required autoComplete="given-name" textContentType="givenName" value={firstName} onChangeText={(v) => { setFirstName(v); setNameError((e) => ({ ...e, firstName: undefined })); }} error={nameError.firstName} />
      <Field label="Last name" required autoComplete="family-name" textContentType="familyName" value={lastName} onChangeText={(v) => { setLastName(v); setNameError((e) => ({ ...e, lastName: undefined })); }} error={nameError.lastName} />
      {nameNotice ? <Banner kind={nameNotice.kind} text={nameNotice.text} /> : null}
      <Button title={busy === "name" ? "Saving…" : "Save name"} disabled={busy !== null} onPress={saveName} />

      <Text style={[s.label, { marginTop: 22 }]}>Email</Text>
      <Field label="Email" required keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={email} onChangeText={(v) => { setEmail(v); setEmailError(""); }} error={emailError} />
      {emailNotice ? <Banner kind={emailNotice.kind} text={emailNotice.text} /> : null}
      <Button title={busy === "email" ? "Sending…" : "Update email"} disabled={busy !== null} onPress={saveEmail} />

      <Text style={[s.label, { marginTop: 22 }]}>Password</Text>
      <Field label="New password" placeholder="At least 8 characters" secureTextEntry autoComplete="new-password" textContentType="newPassword" value={password} onChangeText={(v) => { setPassword(v); setPasswordError((e) => ({ ...e, password: undefined })); }} error={passwordError.password} />
      <Field label="Confirm new password" placeholder="Re-enter password" secureTextEntry autoComplete="new-password" textContentType="newPassword" value={confirm} onChangeText={(v) => { setConfirm(v); setPasswordError((e) => ({ ...e, confirm: undefined })); }} error={passwordError.confirm} />
      {passwordNotice ? <Banner kind={passwordNotice.kind} text={passwordNotice.text} /> : null}
      <Button title={busy === "password" ? "Saving…" : "Change password"} disabled={busy !== null} onPress={savePassword} />
    </FormScreen>
  );
}

export default function Account() {
  const { colors, s } = useTheme();
  const router = useRouter();
  const { session, loading } = useSession();
  const { message } = useLocalSearchParams<{ message?: string }>();

  if (loading) return <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.bg }}><ActivityIndicator color={colors.primary} /></View>;

  if (!session) {
    return (
      <FormScreen>
        <Text style={s.h1}>{"You're browsing as a guest"}</Text>
        <Text style={s.lead}>Sign in to edit your account. Everything else in the app works without one.</Text>
        <Button title="Sign In" onPress={() => router.replace("/login")} />
        <Button title="Create Account" variant="outline" style={{ marginTop: 12 }} onPress={() => router.replace("/signup")} />
      </FormScreen>
    );
  }

  return <EditAccountForm key={session.user.id} session={session} initialMessage={typeof message === "string" ? message : undefined} />;
}
