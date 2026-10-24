import { Image, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ORG_NAME, ORG_SHORT, SUBTITLE, TAGLINE } from "../src/content";
import { Button } from "../src/components/ui";
import { useTheme } from "../src/lib/theme";
import { markWelcomeSeen } from "../src/lib/welcome";

function enter(next?: "/login" | "/signup") {
  void markWelcomeSeen();
  // Home sits under the auth modal so it can be dismissed into the app.
  router.replace("/");
  if (next) router.push(next);
}

/** First launch only. Guests continue into the full app; nothing here is required to use public features. */
export default function Welcome() {
  const { colors, s } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={[s.screen, { flexGrow: 1, justifyContent: "center" }]} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <Image source={require("../assets/images/logo-sejc.png")} style={{ width: 180, height: 96 }} resizeMode="contain" accessibilityLabel="SAC EJC logo" />
          <Text style={[s.h1, { marginTop: 16, textAlign: "center" }]}>{ORG_SHORT}</Text>
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 18, marginTop: 4, textAlign: "center" }}>{TAGLINE}</Text>
          <Text style={[s.lead, { textAlign: "center", marginTop: 10, marginBottom: 0 }]}>{ORG_NAME}</Text>
          <Text style={{ color: colors.muted, fontSize: 15, textAlign: "center", marginTop: 6, lineHeight: 21 }}>{SUBTITLE}</Text>
        </View>
        <Button title="Create Account" onPress={() => enter("/signup")} />
        <Button title="Sign In" variant="outline" style={{ marginTop: 12 }} onPress={() => enter("/login")} />
        <Button title="Continue as guest" variant="outline" style={{ marginTop: 12 }} onPress={() => enter()} />
        <Text style={{ textAlign: "center", color: colors.text, marginTop: 14, lineHeight: 21 }}>
          Browse, join, and donate without an account.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
