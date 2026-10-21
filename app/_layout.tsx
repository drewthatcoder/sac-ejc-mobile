import "../src/lib/deeplink";
import { Stack } from "expo-router";
import { colors } from "../src/theme";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.bg }, headerTitleStyle: { fontWeight: "700" }, headerTintColor: colors.primary }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ presentation: "modal", title: "Sign In" }} />
      <Stack.Screen name="account" options={{ presentation: "modal", title: "Account" }} />
      <Stack.Screen name="auth/callback" options={{ title: "Signing in…", headerBackVisible: false }} />
      <Stack.Screen name="set-password" options={{ title: "Set New Password", headerBackVisible: false }} />
      <Stack.Screen name="signup" options={{ presentation: "modal", title: "Create Account" }} />
    </Stack>
  );
}
