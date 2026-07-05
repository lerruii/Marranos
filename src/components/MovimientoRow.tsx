"use client";

import { useState } from "react";
import { Movimiento } from "@/lib/types";
import { CATEGORIAS } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";
import { MovimientoForm } from "./MovimientoForm";
import { ConfirmSubmitButton } from "./ConfirmSubmitButton";
import { updateMovimiento, deleteMovimiento } from "@/app/lotes/[id]/movimiento-actions";

export function MovimientoRow({ movimiento }: { movimiento: Movimiento }) {
  const [editando, setEditando] = useState(false);
  const categoria = CATEGORIAS.find((c) => c.value === movimiento.categoria);
  const esIngreso = movimiento.tipo === "ingreso";

  if (editando) {
    const action = updateMovimiento.bind(null, movimiento.id, movimiento.lote_id);
    return (
      <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-green-900">Editar movimiento</h3>
          <button
            onClick={() => setEditando(false)}
            className="rounded-lg px-2 py-1 text-sm font-medium text-ink-soft hover:bg-cream-dark"
          >
            Cancelar
          </button>
        </div>
        <MovimientoForm action={action} movimiento={movimiento} submitLabel="Guardar cambios" />
      </div>
    );
  }

  const deleteAction = deleteMovimiento.bind(null, movimiento.id, movimiento.lote_id);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink-soft">{formatDate(movimiento.fecha)}</span>
          <span className="rounded-full bg-cream-dark px-2 py-0.5 text-xs font-semibold text-ink-soft">
            {categoria?.label ?? movimiento.categoria}
          </span>
        </div>
        {movimiento.descripcion && (
          <p className="mt-1 truncate text-sm text-ink">{movimiento.descripcion}</p>
        )}
        {movimiento.cantidad && movimiento.valor_unitario && (
          <p className="mt-0.5 text-xs text-ink-soft">
            {movimiento.cantidad} x {formatMoney(movimiento.valor_unitario)}
          </p>
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        <span className={`font-display text-lg font-semibold ${esIngreso ? "text-green-700" : "text-rust-700"}`}>
          {esIngreso ? "+" : "-"}
          {formatMoney(movimiento.valor_total)}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setEditando(true)}
            aria-label="Editar movimiento"
            className="rounded-lg p-2 text-ink-soft hover:bg-cream-dark"
          >
            ✏️
          </button>
          <form action={deleteAction}>
            <ConfirmSubmitButton
              confirmMessage="¿Eliminar este movimiento?"
              className="rounded-lg p-2 text-ink-soft hover:bg-rust-100 hover:text-rust-700"
            >
              🗑️
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
