import { ScrollView, Text, View } from "react-native";
import { Linking } from "react-native";
import { PAYPAL_DONATE_URL } from "../../src/content";
import { Button, s } from "../../src/components/ui";

export default function Donate() {
  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.h1}>Support Our Work</Text>
      <Text style={s.lead}>Your donation helps fight for cleaner air, sustainable communities, and affordable living across Sacramento.</Text>
      <View style={s.card}>
        <Text style={{ fontSize: 15, lineHeight: 22, marginBottom: 16 }}>Donations are processed securely by PayPal in Safari or your default browser, outside this app. No payment information is collected by this app.</Text>
        <Button title="Donate with PayPal" onPress={() => Linking.openURL(PAYPAL_DONATE_URL)} />
      </View>
    </ScrollView>
  );
}
