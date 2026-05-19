export default function CounselorLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4" />
      <span className="text-ink-3">Loading counselor tools...</span>
    </div>
  );
}
