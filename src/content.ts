// Copied from Lovable project src/shared/constants/content.ts
export const ORG_NAME = "Sacramento Environmental Justice Coalition";
export const ORG_SHORT = "SAC EJC";
export const TAGLINE = "Caring for Creation";
export const SUBTITLE = "Cleaner Air, Sustainable Communities, and Affordable Living";

export const MISSION_PILLARS = [
  { icon: "🌲", title: "Cleaner Air", description: "Advocating for policies that reduce air pollution and protect the health of Sacramento's most vulnerable communities." },
  { icon: "💧", title: "Sustainable Communities", description: "Building resilient neighborhoods through green infrastructure, renewable energy, and equitable resource distribution." },
  { icon: "☀️", title: "Affordable Living", description: "Ensuring that the transition to clean energy benefits all residents with lower utility costs and livable housing." },
];

export const PARTNERS = [
  { name: "Diocese of Sacramento", image: require("../assets/images/partner-diocese.png") },
  { name: "Concilio de Liderazgo Latino", image: require("../assets/images/partner-concilio.png") },
  { name: "GRID Alternatives", image: require("../assets/images/partner-grid.png") },
  { name: "Footprint Project", image: require("../assets/images/partner-footprint.png") },
  { name: "Sacramento Homeless Union", image: require("../assets/images/partner-homeless.png") },
  { name: "CRISJ at Sac State", image: require("../assets/images/partner-crisj.png") },
  { name: "350 Sacramento", image: require("../assets/images/partner-350.png") },
  { name: "California Air Resources Board", image: require("../assets/images/partner-carb.png") },
];

export const CONTACT_FIELDS = [
  { id: "name", label: "Full Name", type: "text", placeholder: "Your name" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { id: "phone", label: "Phone", type: "tel", placeholder: "(916) 555-0123" },
  { id: "subject", label: "Subject", type: "text", placeholder: "What is this about?" },
] as const;

export const INTERESTS = [
  { id: "volunteer", label: "Volunteering" },
  { id: "advocacy", label: "Advocacy & Policy" },
  { id: "education", label: "Community Education" },
  { id: "technical", label: "Technical Support" },
];

export const PAYPAL_DONATE_URL = "https://www.paypal.com/donate/?hosted_button_id=4SN38RK299CZJ";

// Source URL from the live site, with gclid/gad_*/gbraid/wbraid/utm_*/hsa_* tracking params stripped.
export const CLARITY_SOURCE_URL =
  "https://map.clarity.io/world/ds/DHGDP7284?longitude=-121.44953&latitude=38.53786&zoom=10.665&aqiStdId=US-EPA&utm_source=adwords&gclid=x&gbraid=x&gad_source=1";
export function stripTracking(url: string): string {
  const u = new URL(url);
  const drop = (k: string) => /^(utm_|hsa_|gad_)/.test(k) || ["gclid", "gbraid", "wbraid"].includes(k);
  const keep = url.split("?")[1]?.split("&").filter((kv) => !drop(kv.split("=")[0])) ?? [];
  return `${u.origin}${u.pathname}${keep.length ? "?" + keep.join("&") : ""}`;
}
export const CLARITY_MAP_URL = stripTracking(CLARITY_SOURCE_URL);

export const FAQS = [
  { q: "TODO: Drew to fill in — What is SAC EJC?", a: "TODO: Drew to fill in." },
  { q: "TODO: Drew to fill in — How can I volunteer?", a: "TODO: Drew to fill in." },
  { q: "TODO: Drew to fill in — Where does my donation go?", a: "TODO: Drew to fill in." },
  { q: "TODO: Drew to fill in — How is air quality data collected?", a: "TODO: Drew to fill in." },
];
