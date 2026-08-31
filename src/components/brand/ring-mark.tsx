/**
 * Brandmark của thế giới: vòng detector đứt nét, vòng vàng bên trong,
 * tâm va chạm ở giữa. Dùng chung cho landing, trang auth và topbar app.
 */
export function RingMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle
        cx="16"
        cy="16"
        r="13"
        fill="none"
        stroke="var(--pf-geometry)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <circle cx="16" cy="16" r="7" fill="none" stroke="var(--pf-expense)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2" fill="var(--pf-expense)" />
    </svg>
  );
}
