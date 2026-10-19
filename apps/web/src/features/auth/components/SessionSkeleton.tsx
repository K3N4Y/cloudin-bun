/** Shown while the session guard is still awaiting `GET /auth/me`, so a live session never sees the
 *  form flash before `beforeLoad` resolves. */
export function SessionSkeleton() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-6">
      <div className="h-[620px] w-full max-w-[1000px] animate-pulse rounded-[18px] bg-white" />
    </div>
  );
}
