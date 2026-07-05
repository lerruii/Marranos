import Link from "next/link";
import { LoteConTotales } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";

export function LoteCard({ lote }: { lote: LoteConTotales }) {
  const positivo = lote.balance >= 0;
  return (
    <Link
      href={`/lotes/${lote.id}`}
      className="block rounded-2xl border border-line bg-paper p-4 shadow-sm transition hover:border-green-600 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-green-900">{lote.nombre}</h3>
          <p className="mt-0.5 text-xs text-ink-soft">
            {formatDate(lote.fecha_ingreso)} · {lote.numero_animales} animales
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            positivo ? "bg-green-100 text-green-900" : "bg-rust-100 text-rust-700"
          }`}
        >
          {positivo ? "Ganancia" : "Pérdida"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">Invertido</p>
          <p className="mt-0.5 text-sm font-semibold text-rust-700">{formatMoney(lote.total_gastos)}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">Ingresos</p>
          <p className="mt-0.5 text-sm font-semibold text-green-700">{formatMoney(lote.total_ingresos)}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">Balance</p>
          <p className={`mt-0.5 text-sm font-semibold ${positivo ? "text-green-700" : "text-rust-700"}`}>
            {formatMoney(lote.balance)}
          </p>
        </div>
      </div>
    </Link>
  );
}
