"use client";

import { useActionState } from "react";
import { Lote } from "@/lib/types";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/app/lotes/actions";

const inputClass =
  "tap-target w-full rounded-xl border border-line bg-white px-4 text-base text-ink outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export function LoteForm({
  action,
  lote,
  submitLabel,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  lote?: Lote;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="nombre" className={labelClass}>
          Nombre del lote / cocha
        </label>
        <input
          id="nombre"
          name="nombre"
          defaultValue={lote?.nombre}
          required
          placeholder="Ej. Cocha 3 - Camada mayo"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha_ingreso" className={labelClass}>
            Fecha de nacimiento / ingreso
          </label>
          <input
            id="fecha_ingreso"
            name="fecha_ingreso"
            type="date"
            defaultValue={lote?.fecha_ingreso}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="fecha_destete" className={labelClass}>
            Fecha de destete
          </label>
          <input
            id="fecha_destete"
            name="fecha_destete"
            type="date"
            defaultValue={lote?.fecha_destete ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="numero_animales" className={labelClass}>
          Número de animales
        </label>
        <input
          id="numero_animales"
          name="numero_animales"
          type="number"
          min={0}
          step={1}
          defaultValue={lote?.numero_animales ?? ""}
          required
          inputMode="numeric"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="notas" className={labelClass}>
          Notas (opcional)
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          defaultValue={lote?.notas ?? ""}
          placeholder="Cualquier observación sobre este lote"
          className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-rust-100 px-3 py-2 text-sm font-medium text-rust-700">
          {state.error}
        </p>
      )}

      <SubmitButton className="tap-target w-full rounded-xl bg-green-700 text-lg font-semibold text-white transition hover:bg-green-600 active:scale-[0.99]">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
