import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Banner, Button, PrivacyLink, s } from "../src/components/ui";
import { authService, displayName, useSession } from "../src/lib/auth";
import { colors } from "../src/theme";

export default function Account() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator color={colors.primary} /></View>;

  if (!session) {
    return (
      <ScrollView contentContainerStyle={s.screen}>
        <Text style={s.h1}>You're browsing as a guest</Text>
        <Text style={s.lead}>Sign in to manage your SAC EJC account. Everything else in the app works without one.</Text>
        <Button title="Sign In" onPress={() => router.replace("/login")} />
        <PrivacyLink style={{ marginTop: 18 }} />
      </ScrollView>
    );
  }

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

  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.h1}>Hi, {displayName(session)}</Text>
      <View style={s.card}>
        <Text style={s.label}>Signed in as</Text>
        <Text style={{ color: colors.muted, fontSize: 16 }}>{session.user.email}</Text>
      </View>
      {error ? <Banner kind="error" text={error} /> : null}
      <Button title="Sign out" variant="outline" onPress={async () => { await authService.signOut(); router.replace("/"); }} />
      <Button title={busy ? "Deleting…" : "Delete account"} disabled={busy} style={{ marginTop: 14, backgroundColor: colors.error }} onPress={confirmDelete} />
      <PrivacyLink style={{ marginTop: 18 }} />
    </ScrollView>
  );
}
