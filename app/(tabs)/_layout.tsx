import { Link, Tabs } from "expo-router";
import { ColorValue, Pressable, Text } from "react-native";
import { colors } from "../../src/theme";
import { displayName, useSession } from "../../src/lib/auth";

const icon = (e: string) => ({ color }: { color: ColorValue }) => <Text style={{ fontSize: 20, color }}>{e}</Text>;

export default function Layout() {
  const { session } = useSession();
  const name = displayName(session);
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary, headerStyle: { backgroundColor: colors.bg }, headerTitleStyle: { fontWeight: "700" } }}>
      <Tabs.Screen name="index" options={{ title: "Home", headerTitle: "SAC EJC", tabBarIcon: icon("🏠"),
        headerRight: () => (
          <Link href={session ? "/account" : "/login"} asChild>
            <Pressable accessibilityRole="button" accessibilityLabel={session ? "Account" : "Sign in"} style={{ marginRight: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: colors.primary }}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>👤 {name ? (name.length > 14 ? name.slice(0, 13) + "…" : name) : "Sign in"}</Text>
            </Pressable>
          </Link>
        ) }} />
      <Tabs.Screen name="join" options={{ title: "Join", headerTitle: "Join Our Cause", tabBarIcon: icon("🤝") }} />
      <Tabs.Screen name="live-data" options={{ title: "Live Data", tabBarIcon: icon("📈") }} />
      <Tabs.Screen name="donate" options={{ title: "Donate", tabBarIcon: icon("💚") }} />
      <Tabs.Screen name="contact" options={{ title: "Contact", tabBarIcon: icon("✉️") }} />
      <Tabs.Screen name="faq" options={{ href: null, title: "FAQ", tabBarIcon: icon("❓") }} />
    </Tabs>
  );
}
