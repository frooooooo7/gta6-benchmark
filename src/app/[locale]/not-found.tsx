import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="surface-card p-8 max-w-md w-full border border-border-subtle">
        <span className="text-accent-coral font-mono text-5xl font-bold block mb-4 tabular-nums">
          404
        </span>
        <h1 className="font-display text-2xl font-bold text-content-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-content-secondary text-sm mb-6">
          The requested hardware test or page does not exist in our Vice City calibration database.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-accent-teal text-content-inverted font-semibold text-sm btn-interactive"
        >
          Return to FPS Calculator
        </Link>
      </div>
    </main>
  );
}
