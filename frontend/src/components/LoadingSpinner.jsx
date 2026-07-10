export function LoadingSpinner({ className = "" }) {
  return <span className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`} aria-label="ஏற்றப்படுகிறது" />;
}