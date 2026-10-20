import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MISSION_PILLARS, ORG_NAME, PARTNERS, SUBTITLE, TAGLINE } from "../../src/content";
import { Button, s } from "../../src/components/ui";
import { colors } from "../../src/theme";

export default function Home() {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: colors.bg }}>
      <View style={st.hero}>
        <Image source={require("../../assets/images/hero-sacramento.jpg")} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={st.overlay}>
          <Image source={require("../../assets/images/logo-sejc.png")} style={st.logo} resizeMode="contain" accessibilityLabel="SAC EJC logo" />
          <Text style={st.org}>{ORG_NAME}</Text>
          <Text style={st.tagline}>{TAGLINE}</Text>
          <Text style={st.sub}>{SUBTITLE}</Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Button title="Join Our Cause" onPress={() => router.push("/join")} style={{ flex: 1 }} />
            <Button title="Donate" onPress={() => router.push("/donate")} style={{ flex: 1, backgroundColor: colors.accent }} />
          </View>
        </View>
      </View>
      <View style={s.screen}>
        <Text style={s.h1}>Our Mission</Text>
        {MISSION_PILLARS.map((p) => (
          <View key={p.title} style={s.card}>
            <Text style={{ fontSize: 28 }}>{p.icon}</Text>
            <Text style={st.pillarTitle}>{p.title}</Text>
            <Text style={{ color: colors.muted, lineHeight: 21 }}>{p.description}</Text>
          </View>
        ))}
        <Text style={[s.h1, { marginTop: 10 }]}>Our Partners</Text>
        <View style={st.grid}>
          {PARTNERS.map((p) => (
            <View key={p.name} style={st.partner}>
              <Image source={p.image} style={st.partnerImg} resizeMode="contain" accessibilityLabel={p.name} />
              <Text style={st.partnerName}>{p.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  hero: { minHeight: 420 },
  overlay: { flex: 1, backgroundColor: "rgba(15,40,25,0.62)", padding: 24, justifyContent: "center", alignItems: "center" },
  logo: { width: 96, height: 96, marginBottom: 12, borderRadius: 48, backgroundColor: "#fff" },
  org: { color: "#fff", fontSize: 24, fontWeight: "800", textAlign: "center" },
  tagline: { color: "#cfe8c9", fontSize: 18, fontWeight: "600", marginTop: 6 },
  sub: { color: "#eef", fontSize: 15, textAlign: "center", marginTop: 8 },
  pillarTitle: { fontSize: 19, fontWeight: "700", color: colors.text, marginVertical: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  partner: { width: "48%", backgroundColor: "#fff", borderRadius: 12, padding: 10, marginBottom: 12, alignItems: "center", borderWidth: 1, borderColor: colors.border },
  partnerImg: { width: "100%", height: 70 },
  partnerName: { fontSize: 12, textAlign: "center", color: colors.muted, marginTop: 6 },
});
