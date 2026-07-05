"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { CATEGORIAS, CategoriaMovimiento, TipoMovimiento } from "@/lib/types";

export type FormState = { error?: string } | undefined;

function parseMovimientoForm(formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const tipo = String(formData.get("tipo") ?? "") as TipoMovimiento;
  const categoria = String(formData.get("categoria") ?? "") as CategoriaMovimiento;
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const cantidadRaw = String(formData.get("cantidad") ?? "").trim();
  const valorUnitarioRaw = String(formData.get("valor_unitario") ?? "").trim();
  const valorTotalRaw = String(formData.get("valor_total") ?? "").trim();

  if (!fecha) return { error: "La fecha es obligatoria." } as const;
  if (tipo !== "gasto" && tipo !== "ingreso") {
    return { error: "El tipo debe ser gasto o ingreso." } as const;
  }
  if (!CATEGORIAS.some((c) => c.value === categoria)) {
    return { error: "Selecciona una categoría válida." } as const;
  }

  const cantidad = cantidadRaw ? Number(cantidadRaw) : null;
  const valor_unitario = valorUnitarioRaw ? Number(valorUnitarioRaw) : null;
  let valor_total = valorTotalRaw ? Number(valorTotalRaw) : null;

  if (cantidad !== null && !Number.isFinite(cantidad)) {
    return { error: "La cantidad no es un número válido." } as const;
  }
  if (valor_unitario !== null && !Number.isFinite(valor_unitario)) {
    return { error: "El valor unitario no es un número válido." } as const;
  }

  if (valor_total === null && cantidad !== null && valor_unitario !== null) {
    valor_total = cantidad * valor_unitario;
  }

  if (valor_total === null || !Number.isFinite(valor_total) || valor_total <= 0) {
    return {
      error: "Ingresa el valor total, o la cantidad y el valor unitario para calcularlo.",
    } as const;
  }

  return {
    values: {
      fecha,
      tipo,
      categoria,
      descripcion: descripcion || null,
      cantidad,
      valor_unitario,
      valor_total,
    },
  } as const;
}

export async function createMovimiento(
  loteId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseMovimientoForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabaseServer
    .from("movimientos")
    .insert({ ...parsed.values, lote_id: loteId });
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/lotes/${loteId}`);
  redirect(`/lotes/${loteId}`);
}

export async function updateMovimiento(
  id: string,
  loteId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseMovimientoForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabaseServer.from("movimientos").update(parsed.values).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/lotes/${loteId}`);
  redirect(`/lotes/${loteId}`);
}

export async function deleteMovimiento(id: string, loteId: string) {
  const { error } = await supabaseServer.from("movimientos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/lotes/${loteId}`);
  redirect(`/lotes/${loteId}`);
}
