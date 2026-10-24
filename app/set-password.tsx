import { useState } from "react";
import { useRouter } from "expo-router";
import { FormScreen } from "../src/components/form-screen";
import { Banner, Button, Field } from "../src/components/ui";
import { updatePassword, useSession } from "../src/lib/auth";

export default function SetPassword() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ pw?: string; confirm?: string }>({});
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setNotice(null);
    const e: typeof errors = {};
    if (pw.length < 8) e.pw = "Use at least 8 characters";
    if (confirm !== pw) e.confirm = "Passwords don't match";
    setErrors(e);
    if (e.pw || e.confirm) return;
    setBusy(true); const r = await updatePassword(pw); setBusy(false);
    if (!r.ok) return setNotice({ kind: "error", text: r.error });
    router.replace({ pathname: "/account", params: { message: "Your password was updated." } });
  }

  return (
    <FormScreen>
        {!loading && !session ? (
          <Banner kind="error" text="Your reset link has expired or was already used. Please request a new one from Sign In." />
        ) : (
          <>
            <Field label="New Password" placeholder="At least 8 characters" secureTextEntry value={pw} onChangeText={(v) => { setPw(v); setErrors((x) => ({ ...x, pw: undefined })); }} error={errors.pw} />
            <Field label="Confirm New Password" placeholder="Re-enter password" secureTextEntry value={confirm} onChangeText={(v) => { setConfirm(v); setErrors((x) => ({ ...x, confirm: undefined })); }} error={errors.confirm} />
            {notice ? <Banner kind={notice.kind} text={notice.text} /> : null}
            <Button title={busy ? "Saving…" : "Save new password"} onPress={save} disabled={busy} />
          </>
        )}
    </FormScreen>
  );
}
