export function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-green-700"
      : tone === "negative"
        ? "text-rust-700"
        : "text-ink";

  return (
    <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm">
      <p className="text-sm font-medium text-ink-soft">{label}</p>
      <p className={`font-display mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}
