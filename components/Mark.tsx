import { MARK_PATH } from "./mark-path";

/** The A mark. Inherits `fill` from CSS (defaults to the ink color). */
export function Mark({ className = "mark-icon" }: { className?: string }) {
  return (
    <svg viewBox="0 0 612 612" aria-hidden="true" className={className}>
      <path d={MARK_PATH} />
    </svg>
  );
}
