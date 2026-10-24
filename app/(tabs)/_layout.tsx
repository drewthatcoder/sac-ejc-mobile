import { Link, Tabs } from "expo-router";
import { ColorValue, Pressable, Text } from "react-native";
import { ThemedHeaderTitle } from "../../src/components/ui";
import { firstName, useSession } from "../../src/lib/auth";
import { useTheme } from "../../src/lib/theme";

function HomeHeaderTitle() {
  return <ThemedHeaderTitle>SAC EJC</ThemedHeaderTitle>;
}

function JoinHeaderTitle() {
  return <ThemedHeaderTitle>Join Our Cause</ThemedHeaderTitle>;
}

function icon(emoji: string) {
  function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
  }
  return TabIcon;
}

export default function Layout() {
  const { session } = useSession();
  const name = firstName(session);
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      headerStyle: { backgroundColor: colors.bg },
      headerTitle: ThemedHeaderTitle,
      headerTintColor: colors.primary,
      headerShadowVisible: false,
      sceneStyle: { backgroundColor: colors.bg },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home", headerTitle: HomeHeaderTitle, tabBarIcon: icon("🏠"),
        headerRight: () => (
          <Link href={session ? "/account" : "/login"} asChild>
            <Pressable accessibilityRole="button" accessibilityLabel={session ? "Account" : "Sign in"} style={{ marginRight: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: colors.primary }}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>👤 {name ? (name.length > 14 ? name.slice(0, 13) + "…" : name) : "Sign in"}</Text>
            </Pressable>
          </Link>
        ) }} />
      <Tabs.Screen name="join" options={{ title: "Join", headerTitle: JoinHeaderTitle, tabBarIcon: icon("🤝") }} />
      <Tabs.Screen name="live-data" options={{ title: "Live Data", tabBarIcon: icon("📈") }} />
      <Tabs.Screen name="donate" options={{ title: "Donate", tabBarIcon: icon("💚") }} />
      <Tabs.Screen name="contact" options={{ title: "Contact", tabBarIcon: icon("✉️") }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: icon("⚙️") }} />
    </Tabs>
  );
}
