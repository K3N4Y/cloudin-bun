import { useLogout } from "../api";
import { AuthShell } from "../components/AuthShell";
import { useSession } from "../session";

export function HomePage() {
  const { user } = useSession();
  const logout = useLogout();

  return (
    <AuthShell>
      <p className="text-[13px] text-muted">Signed in as</p>
      <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-ink">{user?.email}</p>
      <p className="mt-1 text-[13px] text-muted">{user?.username}</p>

      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="mt-7 h-10 w-full rounded-md bg-btn text-[13px] font-medium text-white hover:bg-[#1f2937] disabled:opacity-60"
      >
        Log out
      </button>
    </AuthShell>
  );
}
