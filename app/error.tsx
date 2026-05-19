"use client";

export default function RootError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-rose mb-2">Unexpected Error</h1>
      <p className="text-ink-3 mb-4">An unexpected error occurred. Please try again or contact support.</p>
      <button className="bg-brand text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
