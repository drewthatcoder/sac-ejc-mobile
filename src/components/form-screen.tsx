import { ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { FormFocusProvider } from "./form-focus";
import { useTheme } from "../lib/theme";

/** Scrollable form shell: tap outside or drag to dismiss, and keep the focused field above the keyboard. */
export function FormScreen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const { colors, s } = useTheme();
  return (
    <FormFocusProvider>
      <KeyboardAvoidingView
        style={[{ flex: 1, backgroundColor: colors.bg }, style]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          contentContainerStyle={[s.screen, { flexGrow: 1 }]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flexGrow: 1 }}>{children}</View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </FormFocusProvider>
  );
}
