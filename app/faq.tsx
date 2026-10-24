import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { FAQS } from "../src/content";
import { useTheme } from "../src/lib/theme";

// TODO: Drew to fill in real questions and answers in src/content.ts (FAQS).
export default function Faq() {
  const { colors, s } = useTheme();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ScrollView contentContainerStyle={s.screen} style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={s.h1}>Frequently Asked Questions</Text>
      <Text style={[s.lead, { color: colors.error }]}>Placeholder content — TODO: Drew to fill in.</Text>
      {FAQS.map((f, i) => (
        <Pressable key={i} style={s.card} onPress={() => setOpen(open === i ? null : i)} accessibilityRole="button">
          <Text style={{ fontWeight: "700", fontSize: 16, color: colors.text }}>{open === i ? "▾ " : "▸ "}{f.q}</Text>
          {open === i ? <Text style={{ marginTop: 8, color: colors.muted }}>{f.a}</Text> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}
