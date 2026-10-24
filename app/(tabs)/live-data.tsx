import { ScrollView, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { CLARITY_MAP_URL } from "../../src/content";
import { Button } from "../../src/components/ui";
import { useTheme } from "../../src/lib/theme";

export default function LiveData() {
  const { colors, s } = useTheme();
  return (
    <ScrollView contentContainerStyle={s.screen} style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={s.h1}>Live Air Quality</Text>
      <Text style={s.lead}>See real-time air quality readings from community sensors across the Sacramento region, powered by Clarity.</Text>
      <View style={s.card}>
        <Text style={[s.body, { marginBottom: 16 }]}>The map uses the US EPA Air Quality Index. It opens in your browser.</Text>
        <Button title="Open Air Quality Map" onPress={() => WebBrowser.openBrowserAsync(CLARITY_MAP_URL)} />
      </View>
    </ScrollView>
  );
}
