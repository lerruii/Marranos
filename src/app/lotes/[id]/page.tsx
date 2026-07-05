import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { StatCard } from "@/components/StatCard";
import { AddMovimientoPanel } from "@/components/AddMovimientoPanel";
import { MovimientoRow } from "@/components/MovimientoRow";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { getLote, getMovimientos } from "@/lib/data";
import { calcularAnimalesVendidos, calcularTotales } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";
import { deleteLote } from "../actions";
import { createMovimiento } from "./movimiento-actions";

export default async function LoteDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ desde?: string; hasta?: string }>;
}) {
  const { id } = await params;
  const { desde, hasta } = await searchParams;

  const lote = await getLote(id);
  if (!lote) notFound();

  const hayFiltro = Boolean(desde || hasta);
  const [movimientos, todosLosMovimientos] = await Promise.all([
    getMovimientos(id, { desde, hasta }),
    hayFiltro ? getMovimientos(id) : Promise.resolve(null),
  ]);
  const totales = calcularTotales(movimientos);
  const animalesVendidos = calcularAnimalesVendidos(todosLosMovimientos ?? movimientos);
  const animalesRestantes = Math.max(0, lote.numero_animales - animalesVendidos);

  const exportUrl = new URLSearchParams({ loteId: id });
  if (desde) exportUrl.set("desde", desde);
  if (hasta) exportUrl.set("hasta", hasta);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Link href="/" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← Volver al resumen
        </Link>

        <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-green-900">{lote.nombre}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Ingreso: {formatDate(lote.fecha_ingreso)}
              {lote.fecha_destete && ` · Destete: ${formatDate(lote.fecha_destete)}`}
              {" · "}
              {animalesVendidos > 0
                ? `${animalesRestantes} de ${lote.numero_animales} animales (${animalesVendidos} vendidos)`
                : `${lote.numero_animales} animales`}
            </p>
            {lote.notas && <p className="mt-1 text-sm text-ink-soft">{lote.notas}</p>}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/lotes/${id}/editar`}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-cream-dark"
            >
              Editar
            </Link>
            <form action={deleteLote.bind(null, id)}>
              <ConfirmSubmitButton
                confirmMessage={`¿Eliminar el lote "${lote.nombre}" y todos sus movimientos? Esta acción no se puede deshacer.`}
                className="rounded-lg border border-rust-700/30 bg-rust-100 px-3 py-2 text-sm font-semibold text-rust-700 hover:bg-rust-100/70"
              >
                Eliminar
              </ConfirmSubmitButton>
            </form>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total invertido" value={formatMoney(totales.total_gastos)} tone="negative" />
          <StatCard label="Total ingresos" value={formatMoney(totales.total_ingresos)} tone="positive" />
          <StatCard
            label="Balance neto"
            value={formatMoney(totales.balance)}
            tone={totales.balance >= 0 ? "positive" : "negative"}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-line bg-paper p-4">
          <form className="flex flex-wrap items-end gap-3" method="get">
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
              <Link
                href={`/lotes/${id}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-cream-dark"
              >
                Quitar filtro
              </Link>
            )}
          </form>
          <a
            href={`/api/exportar?${exportUrl.toString()}`}
            className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-cream-dark"
          >
            ⬇ Exportar CSV
          </a>
        </div>

        <div className="space-y-3">
          <AddMovimientoPanel action={createMovimiento.bind(null, id)} />

          {movimientos.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
              {hayFiltro
                ? "No hay movimientos en ese rango de fechas."
                : "Todavía no hay movimientos registrados en este lote."}
            </p>
          ) : (
            movimientos.map((m) => <MovimientoRow key={m.id} movimiento={m} />)
          )}
        </div>
      </main>
    </>
  );
}
