import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../lib/theme";

/** Shared by every text field so one iOS toolbar covers the whole app. */
export const KEYBOARD_ACCESSORY_ID = "sacejc-keyboard-done";

type FocusApi = {
  register: (focus: () => void) => { id: number; unregister: () => void };
  focusNext: (id: number) => void;
  placement: (id: number) => { index: number; count: number };
};

const FormFocusContext = createContext<FocusApi | null>(null);
const FormFocusVersionContext = createContext(0);

export function FormFocusProvider({ children }: { children: React.ReactNode }) {
  const fields = useRef(new Map<number, () => void>());
  const order = useRef<number[]>([]);
  const nextId = useRef(1);
  const [version, setVersion] = useState(0);

  const api = useMemo<FocusApi>(() => ({
    register(focus) {
      const id = nextId.current++;
      fields.current.set(id, focus);
      order.current.push(id);
      setVersion((v) => v + 1);
      return {
        id,
        unregister() {
          fields.current.delete(id);
          order.current = order.current.filter((x) => x !== id);
          setVersion((v) => v + 1);
        },
      };
    },
    focusNext(id) {
      const index = order.current.indexOf(id);
      const next = order.current[index + 1];
      if (next == null) Keyboard.dismiss();
      else fields.current.get(next)?.();
    },
    placement(id) {
      return { index: order.current.indexOf(id), count: order.current.length };
    },
  }), []);

  return (
    <FormFocusContext.Provider value={api}>
      <FormFocusVersionContext.Provider value={version}>{children}</FormFocusVersionContext.Provider>
    </FormFocusContext.Provider>
  );
}

export function useFormFocus(): FocusApi | null {
  return useContext(FormFocusContext);
}

/** Re-renders when fields register so return-key labels stay in order. */
export function useFieldPlacement(id: number | null): { index: number; count: number } {
  const version = useContext(FormFocusVersionContext);
  const api = useContext(FormFocusContext);
  void version;
  if (!api || id == null) return { index: -1, count: 0 };
  return api.placement(id);
}

/** iOS keyboard toolbar with Done. Android keyboards use the system back/return key. */
export function KeyboardDoneAccessory() {
  const { colors } = useTheme();
  if (Platform.OS !== "ios") return null;
  return (
    <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", backgroundColor: colors.keyboardBar, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingHorizontal: 8, minHeight: 44 }} accessibilityRole="toolbar">
        <Pressable onPress={Keyboard.dismiss} accessibilityRole="button" accessibilityLabel="Done" hitSlop={8} style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
          <Text style={{ color: colors.primary, fontSize: 17, fontWeight: "600" }}>Done</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}
