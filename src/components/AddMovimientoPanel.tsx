"use client";

import { useState } from "react";
import { MovimientoForm } from "./MovimientoForm";
import type { FormState } from "@/app/lotes/[id]/movimiento-actions";

export function AddMovimientoPanel({
  action,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="tap-target w-full rounded-xl border-2 border-dashed border-green-700/40 text-base font-semibold text-green-700 transition hover:bg-green-100"
      >
        + Registrar gasto o ingreso
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-green-900">Nuevo movimiento</h3>
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg px-2 py-1 text-sm font-medium text-ink-soft hover:bg-cream-dark"
        >
          Cancelar
        </button>
      </div>
      <MovimientoForm action={action} submitLabel="Guardar movimiento" onDone={() => setOpen(false)} />
    </div>
  );
}
