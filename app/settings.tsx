import { Pressable, ScrollView, Text, View } from "react-native";
import { Appearance } from "../src/theme";
import { useTheme } from "../src/lib/theme";

const OPTIONS: { id: Appearance; title: string; detail: string }[] = [
  { id: "system", title: "System", detail: "Match this device" },
  { id: "light", title: "Light", detail: "Always use light mode" },
  { id: "dark", title: "Dark", detail: "Always use dark mode" },
];

/** Appearance is local-only and does not require an account. */
export default function Settings() {
  const { colors, s, appearance, setAppearance } = useTheme();
  return (
    <ScrollView contentContainerStyle={s.screen} style={{ backgroundColor: colors.bg }}>
      <Text style={s.h1}>Settings</Text>
      <Text style={s.lead}>Choose how SAC EJC looks. System follows your device.</Text>
      <Text style={s.label}>Appearance</Text>
      {OPTIONS.map((option) => {
        const selected = appearance === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => setAppearance(option.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${option.title}. ${option.detail}`}
            style={{ padding: 14, borderRadius: 12, borderWidth: 2, marginBottom: 10, borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.selectedBg : colors.card }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{option.title}</Text>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>{selected ? "✓" : ""}</Text>
            </View>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{option.detail}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
