import { Linking, ScrollView, Text, View } from "react-native";
import { PAYPAL_DONATE_URL } from "../../src/content";
import { Button } from "../../src/components/ui";
import { useTheme } from "../../src/lib/theme";

export default function Donate() {
  const { colors, s } = useTheme();
  return (
    <ScrollView contentContainerStyle={s.screen} style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={s.h1}>Support Our Work</Text>
      <Text style={s.lead}>Your donation helps fight for cleaner air, sustainable communities, and affordable living across Sacramento.</Text>
      <View style={s.card}>
        <Text style={[s.body, { marginBottom: 16 }]}>Donations are processed securely by PayPal in Safari or your default browser, outside this app. No payment information is collected by this app.</Text>
        <Button title="Donate with PayPal" onPress={() => Linking.openURL(PAYPAL_DONATE_URL)} />
      </View>
    </ScrollView>
  );
}
