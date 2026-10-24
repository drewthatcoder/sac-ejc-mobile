import { useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Banner, Button } from "../../src/components/ui";
import { PRIVACY_POLICY_URL } from "../../src/content";
import { authService, displayName, useSession } from "../../src/lib/auth";
import { useTheme } from "../../src/lib/theme";
import { Appearance } from "../../src/theme";

const OPTIONS: { id: Appearance; title: string; detail: string }[] = [
  { id: "system", title: "System", detail: "Match this device" },
  { id: "light", title: "Light", detail: "Always use light mode" },
  { id: "dark", title: "Dark", detail: "Always use dark mode" },
];

const APP_VERSION = Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

function LinkRow({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      onPress={onPress}
      style={{ padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginBottom: 10 }}
    >
      <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{title}</Text>
      <Text style={{ color: colors.muted, marginTop: 4 }}>{detail}</Text>
    </Pressable>
  );
}

/** Settings is available to guests. Account actions appear only when someone is signed in. */
export default function Settings() {
  const { colors, s, appearance, setAppearance } = useTheme();
  const { session, loading } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const confirmDelete = () =>
    Alert.alert("Delete account?", "This permanently deletes your SAC EJC account and profile. This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          setError(null); setBusy(true);
          const r = await authService.deleteAccount();
          setBusy(false);
          if (r.ok) router.replace("/"); else setError(r.error);
        },
      },
    ]);

  if (loading) return <View style={{ flex: 1, justifyContent: "center", backgroundColor: colors.bg }}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <ScrollView contentContainerStyle={s.screen} style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={s.h1}>Settings</Text>
      <Text style={s.lead}>Appearance, your account, and support.</Text>

      <Text style={s.label}>Appearance</Text>
      {OPTIONS.map((option) => {
        const selected = appearance === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => setAppearance(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.title}. ${option.detail}`}
            style={{ padding: 14, borderRadius: 12, borderWidth: 2, marginBottom: 10, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.selectedBg : colors.card }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{option.title}</Text>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>{selected ? "✓" : ""}</Text>
            </View>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{option.detail}</Text>
          </Pressable>
        );
      })}

      <Text style={[s.label, { marginTop: 12 }]}>Account</Text>
      {session ? (
        <>
          <View style={s.card}>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>Hi, {displayName(session)}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{session.user.email}</Text>
          </View>
          {error ? <Banner kind="error" text={error} /> : null}
          <Button title="Edit account info" onPress={() => router.push("/account")} />
          <Button title="Sign out" variant="outline" style={{ marginTop: 12 }} onPress={async () => { await authService.signOut(); }} />
          <Button title={busy ? "Deleting…" : "Delete account"} disabled={busy} style={{ marginTop: 12, backgroundColor: colors.errorButton }} onPress={confirmDelete} />
        </>
      ) : (
        <>
          <Text style={[s.lead, { marginTop: 0 }]}>Sign in to manage your account. You can keep using the rest of the app as a guest.</Text>
          <Button title="Sign In" onPress={() => router.push("/login")} />
          <Button title="Create Account" variant="outline" style={{ marginTop: 12 }} onPress={() => router.push("/signup")} />
        </>
      )}

      <Text style={[s.label, { marginTop: 22 }]}>Support</Text>
      <LinkRow title="Privacy Policy" detail="How SAC EJC handles your information" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} />
      <LinkRow title="FAQ" detail="Common questions" onPress={() => router.push("/faq")} />
      <LinkRow title="Contact" detail="Questions and support" onPress={() => router.push("/contact")} />

      <Text style={{ textAlign: "center", color: colors.muted, marginTop: 18 }} accessibilityLabel={`App version ${APP_VERSION}`}>Version {APP_VERSION}</Text>
    </ScrollView>
  );
}
