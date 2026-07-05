import Link from "next/link";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { LoteCard } from "@/components/LoteCard";
import { getLotesConTotales, getConsolidado } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; desde?: string; hasta?: string }>;
}) {
  const { q, desde, hasta } = await searchParams;

  const lotes = await getLotesConTotales({ desde, hasta });
  const filtrados = q
    ? lotes.filter((l) => l.nombre.toLowerCase().includes(q.toLowerCase()))
    : lotes;
  const consolidado = getConsolidado(filtrados);
  const hayFiltro = Boolean(q || desde || hasta);

  const exportUrl = new URLSearchParams();
  if (desde) exportUrl.set("desde", desde);
  if (hasta) exportUrl.set("hasta", hasta);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-green-900">Resumen general</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {consolidado.totalLotes} {consolidado.totalLotes === 1 ? "lote" : "lotes"} ·{" "}
              {consolidado.totalAnimalesRestantes} animales actuales
              {consolidado.totalAnimalesRestantes !== consolidado.totalAnimales &&
                ` (de ${consolidado.totalAnimales} ingresados)`}
            </p>
          </div>
          <Link
            href="/lotes/nuevo"
            className="tap-target flex items-center rounded-xl bg-green-700 px-5 text-base font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-[0.99]"
          >
            + Nuevo lote
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total invertido" value={formatMoney(consolidado.totalGastos)} tone="negative" />
          <StatCard label="Total ingresos" value={formatMoney(consolidado.totalIngresos)} tone="positive" />
          <StatCard
            label="Balance neto consolidado"
            value={formatMoney(consolidado.balance)}
            tone={consolidado.balance >= 0 ? "positive" : "negative"}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-line bg-paper p-4">
          <form className="flex flex-wrap items-end gap-3" method="get">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Buscar lote</label>
              <input
                type="text"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Nombre del lote"
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Desde</label>
              <input
                type="date"
                name="desde"
                defaultValue={desde ?? ""}
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Hasta</label>
              <input
                type="date"
                name="hasta"
                defaultValue={hasta ?? ""}
                className="rounded-lg border border-line bg-white px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
            >
              Filtrar
            </button>
            {hayFiltro && (
              <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-cream-dark">
                Quitar filtros
              </Link>
            )}
          </form>
          <a
            href={`/api/exportar?${exportUrl.toString()}`}
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-cream-dark"
          >
            ⬇ Exportar todo (CSV)
          </a>
        </div>

        {filtrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-10 text-center">
            <p className="text-ink-soft">
              {hayFiltro ? "No hay lotes que coincidan con la búsqueda." : "Todavía no tienes lotes registrados."}
            </p>
            {!hayFiltro && (
              <Link href="/lotes/nuevo" className="mt-3 inline-block font-semibold text-green-700">
                Crea tu primer lote →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtrados.map((lote) => (
              <LoteCard key={lote.id} lote={lote} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
