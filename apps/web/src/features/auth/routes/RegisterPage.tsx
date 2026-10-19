import { AuthForm } from "../components/AuthForm";
import { AuthShell } from "../components/AuthShell";

export function RegisterPage() {
  return (
    <AuthShell>
      <AuthForm mode="register" />
    </AuthShell>
  );
}
