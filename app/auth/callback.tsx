import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Banner, Button, s } from "../../src/components/ui";
import { handleAuthCallbackUrl } from "../../src/lib/auth";
import { latestAuthUrl, onDeepLink } from "../../src/lib/deeplink";
import { colors } from "../../src/theme";

/** Landing route for sacejc://auth/callback (email confirmation, magic link, password recovery). */
export default function AuthCallback() {
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(latestAuthUrl()); // full URL incl. #fragment
  useEffect(() => onDeepLink((u) => { if (u.includes("auth/callback")) setUrl(u); }), []);
  const handled = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || handled.current === url) return;
    handled.current = url;
    handleAuthCallbackUrl(url).then((r) => {
      if (!r.ok) return setError(r.error);
      if (r.type === "recovery") router.replace("/set-password");
      else router.replace({ pathname: "/account", params: { message: "Email confirmed, you're signed in." } });
    });
  }, [url]);

  useEffect(() => {
    const t = setTimeout(() => { if (!handled.current) setError("This link is invalid or has already been used. Please request a new one."); }, 8000);
    return () => clearTimeout(t);
  }, []);

  if (!error) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg }}><ActivityIndicator color={colors.primary} /><Text style={{ marginTop: 12, color: colors.muted }}>Signing you in…</Text></View>;
  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Stack.Screen options={{ title: "Link Problem" }} />
      <Text style={s.h1}>Link problem</Text>
      <Banner kind="error" text={error} />
      <Button title="Go to Sign In" onPress={() => router.replace("/login")} />
      <Button title="Back to Home" variant="outline" style={{ marginTop: 12 }} onPress={() => router.replace("/")} />
    </ScrollView>
  );
}
