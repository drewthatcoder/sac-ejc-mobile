import { latestAuthUrl, onDeepLink } from "../src/lib/deeplink";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Linking, StyleSheet, View } from "react-native";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider, usePathname, useRootNavigationState, useRouter, useSegments, type Theme } from "expo-router";
import { KeyboardDoneAccessory } from "../src/components/form-focus";
import { ThemedHeaderTitle } from "../src/components/ui";
import { useSession } from "../src/lib/auth";
import { ThemeProvider, useTheme } from "../src/lib/theme";
import { markWelcomeSeen, peekWelcomeSeen, useWelcomeSeen } from "../src/lib/welcome";

function isAuthCallback(url: string | null | undefined): boolean {
  return !!url && url.includes("auth/callback");
}

function isWelcomePath(pathname: string): boolean {
  return pathname === "/welcome" || pathname.endsWith("/welcome");
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { colors, scheme } = useTheme();
  const navigationTheme = useMemo<Theme>(() => {
    const base = scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      dark: scheme === "dark",
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.bg,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        notification: colors.error,
      },
    };
  }, [colors, scheme]);
  const pathname = usePathname();
  const segments = useSegments();
  const router = useRouter();
  const nav = useRootNavigationState();
  const navReady = !!nav?.key;
  const { session, loading: sessionLoading } = useSession();
  const { loaded: welcomeLoaded, seen: welcomeSeen } = useWelcomeSeen();
  const welcomeDismissed = welcomeSeen || peekWelcomeSeen();
  const [authLaunch, setAuthLaunch] = useState(() => isAuthCallback(latestAuthUrl()));
  const [authChecked, setAuthChecked] = useState(() => isAuthCallback(latestAuthUrl()));
  const [gaveUp, setGaveUp] = useState(false);
  const pendingAuthNav = useRef(false);

  useEffect(() => onDeepLink((url) => {
    if (!isAuthCallback(url)) return;
    setAuthLaunch(true);
    setAuthChecked(true);
    pendingAuthNav.current = true;
  }), []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    Linking.getInitialURL().then((url) => {
      if (cancelled) return;
      if (isAuthCallback(url) || isAuthCallback(latestAuthUrl())) {
        setAuthLaunch(true);
        setAuthChecked(true);
        pendingAuthNav.current = true;
        return;
      }
      // Android sometimes delivers the launch URL only through the event listener.
      if (!url) {
        timer = setTimeout(() => {
          if (cancelled) return;
          if (isAuthCallback(latestAuthUrl())) {
            setAuthLaunch(true);
            pendingAuthNav.current = true;
          }
          setAuthChecked(true);
        }, 350);
        return;
      }
      setAuthChecked(true);
    }).catch(() => { if (!cancelled) setAuthChecked(true); });
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  const onAuthRoute = segments.some((segment) => segment === "auth" || segment === "set-password" || segment === "callback")
    || pathname.includes("auth/callback")
    || pathname.includes("set-password");
  const ready = authChecked && welcomeLoaded && !sessionLoading && navReady;
  // Session skips the screen entirely. A launch URL for auth/callback must win over welcome.
  const showWelcome = ready && !welcomeDismissed && !session && !authLaunch && !onAuthRoute;

  useEffect(() => {
    if (session && !peekWelcomeSeen()) void markWelcomeSeen();
  }, [session]);

  useEffect(() => {
    if (!navReady || !pendingAuthNav.current) return;
    if (pathname.includes("auth/callback")) {
      pendingAuthNav.current = false;
      return;
    }
    pendingAuthNav.current = false;
    router.replace("/auth/callback");
  }, [navReady, pathname, router, authLaunch]);

  useEffect(() => {
    if (!showWelcome || isWelcomePath(pathname)) return;
    router.replace("/welcome");
  }, [showWelcome, pathname, router]);

  useEffect(() => {
    if (!showWelcome || isWelcomePath(pathname)) return;
    const timer = setTimeout(() => setGaveUp(true), 2500);
    return () => clearTimeout(timer);
  }, [showWelcome, pathname]);

  const cover = !onAuthRoute && !authLaunch && !gaveUp && (!ready || (showWelcome && !isWelcomePath(pathname)));

  return (
    <NavigationThemeProvider value={navigationTheme}>
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack screenOptions={{ headerStyle: { backgroundColor: colors.bg }, headerTitle: ThemedHeaderTitle, headerTintColor: colors.primary, contentStyle: { backgroundColor: colors.bg }, headerShadowVisible: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ presentation: "modal", title: "Sign In" }} />
        <Stack.Screen name="account" options={{ presentation: "modal", title: "Account" }} />
        <Stack.Screen name="auth/callback" options={{ title: "Signing in…", headerBackVisible: false }} />
        <Stack.Screen name="set-password" options={{ title: "Set New Password", headerBackVisible: false }} />
        <Stack.Screen name="signup" options={{ presentation: "modal", title: "Create Account" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="welcome" options={{ headerShown: false, gestureEnabled: false, animation: "none" }} />
      </Stack>
      <KeyboardDoneAccessory />
      {cover ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }]} pointerEvents="auto">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}
    </View>
    </NavigationThemeProvider>
  );
}
