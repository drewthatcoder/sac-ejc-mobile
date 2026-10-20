import { ScrollView, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { PAYPAL_DONATE_URL } from "../../src/content";
import { Button, s } from "../../src/components/ui";

export default function Donate() {
  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.h1}>Support Our Work</Text>
      <Text style={s.lead}>Your donation helps fight for cleaner air, sustainable communities, and affordable living across Sacramento.</Text>
      <View style={s.card}>
        <Text style={{ fontSize: 15, lineHeight: 22, marginBottom: 16 }}>Donations are processed securely by PayPal in your browser. No payment information is collected by this app.</Text>
        <Button title="Donate with PayPal" onPress={() => WebBrowser.openBrowserAsync(PAYPAL_DONATE_URL)} />
      </View>
    </ScrollView>
  );
}
