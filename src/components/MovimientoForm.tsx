"use client";

import { useActionState, useMemo, useState } from "react";
import { CATEGORIAS, Movimiento, TipoMovimiento } from "@/lib/types";
import { todayISO } from "@/lib/format";
import { SubmitButton } from "./SubmitButton";
import type { FormState } from "@/app/lotes/[id]/movimiento-actions";

const inputClass =
  "tap-target w-full rounded-xl border border-line bg-white px-4 text-base text-ink outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export function MovimientoForm({
  action,
  movimiento,
  submitLabel,
  onDone,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  movimiento?: Movimiento;
  submitLabel: string;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const [tipo, setTipo] = useState<TipoMovimiento>(movimiento?.tipo ?? "gasto");
  const [cantidad, setCantidad] = useState(movimiento?.cantidad?.toString() ?? "");
  const [valorUnitario, setValorUnitario] = useState(movimiento?.valor_unitario?.toString() ?? "");
  const [valorTotal, setValorTotal] = useState(movimiento?.valor_total?.toString() ?? "");

  const categoriasDisponibles = useMemo(
    () => CATEGORIAS.filter((c) => c.tipo === tipo || c.tipo === "ambos"),
    [tipo]
  );
  const [categoria, setCategoria] = useState(movimiento?.categoria ?? categoriasDisponibles[0]?.value);
  const esVentaAnimal = categoria === "venta_animal";

  function actualizarCalculado(nuevaCantidad: string, nuevoUnitario: string) {
    const c = Number(nuevaCantidad);
    const u = Number(nuevoUnitario);
    if (nuevaCantidad && nuevoUnitario && Number.isFinite(c) && Number.isFinite(u)) {
      setValorTotal((c * u).toString());
    }
  }

  return (
    <form action={formAction} className="space-y-4" onSubmit={() => onDone?.()}>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setTipo("gasto");
            setCategoria(CATEGORIAS.find((c) => c.tipo === "gasto")!.value);
          }}
          className={`tap-target rounded-xl border text-base font-semibold transition ${
            tipo === "gasto"
              ? "border-rust-700 bg-rust-100 text-rust-700"
              : "border-line bg-white text-ink-soft"
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => {
            setTipo("ingreso");
            setCategoria(CATEGORIAS.find((c) => c.tipo === "ingreso")!.value);
          }}
          className={`tap-target rounded-xl border text-base font-semibold transition ${
            tipo === "ingreso"
              ? "border-green-700 bg-green-100 text-green-900"
              : "border-line bg-white text-ink-soft"
          }`}
        >
          Ingreso
        </button>
      </div>
      <input type="hidden" name="tipo" value={tipo} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className={labelClass}>
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            defaultValue={movimiento?.fecha ?? todayISO()}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="categoria" className={labelClass}>
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as typeof categoria)}
            required
            className={inputClass}
          >
            {categoriasDisponibles.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className={labelClass}>
          Descripción (opcional)
        </label>
        <input
          id="descripcion"
          name="descripcion"
          defaultValue={movimiento?.descripcion ?? ""}
          placeholder="Ej. Bulto x40kg Purina Engorde"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cantidad" className={labelClass}>
            {esVentaAnimal ? "Cantidad de animales vendidos" : "Cantidad (opcional)"}
          </label>
          <input
            id="cantidad"
            name="cantidad"
            type="number"
            step="any"
            inputMode="decimal"
            value={cantidad}
            onChange={(e) => {
              setCantidad(e.target.value);
              actualizarCalculado(e.target.value, valorUnitario);
            }}
            placeholder="Ej. 5"
            className={inputClass}
          />
          {esVentaAnimal && (
            <p className="mt-1 text-xs text-ink-soft">
              Llénala para que &ldquo;animales restantes&rdquo; del lote se actualice solo.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="valor_unitario" className={labelClass}>
            Valor unitario (opcional)
          </label>
          <input
            id="valor_unitario"
            name="valor_unitario"
            type="number"
            step="any"
            inputMode="decimal"
            value={valorUnitario}
            onChange={(e) => {
              setValorUnitario(e.target.value);
              actualizarCalculado(cantidad, e.target.value);
            }}
            placeholder="Ej. 95000"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="valor_total" className={labelClass}>
          Valor total
        </label>
        <input
          id="valor_total"
          name="valor_total"
          type="number"
          step="any"
          inputMode="decimal"
          required
          value={valorTotal}
          onChange={(e) => setValorTotal(e.target.value)}
          placeholder="Se calcula solo si llenas cantidad y valor unitario"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Se calcula automáticamente si llenas cantidad y valor unitario, o puedes escribirlo directo.
        </p>
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
