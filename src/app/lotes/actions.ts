"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export type FormState = { error?: string } | undefined;

function parseLoteForm(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fecha_ingreso = String(formData.get("fecha_ingreso") ?? "");
  const fecha_desteteRaw = String(formData.get("fecha_destete") ?? "").trim();
  const numero_animalesRaw = String(formData.get("numero_animales") ?? "");
  const notas = String(formData.get("notas") ?? "").trim();

  if (!nombre) return { error: "El nombre del lote es obligatorio." } as const;
  if (!fecha_ingreso) return { error: "La fecha de nacimiento/ingreso es obligatoria." } as const;

  const numero_animales = Number(numero_animalesRaw);
  if (!Number.isFinite(numero_animales) || numero_animales < 0) {
    return { error: "El número de animales debe ser un número válido." } as const;
  }

  return {
    values: {
      nombre,
      fecha_ingreso,
      fecha_destete: fecha_desteteRaw || null,
      numero_animales: Math.round(numero_animales),
      notas: notas || null,
    },
  } as const;
}

export async function createLote(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseLoteForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabaseServer.from("lotes").insert(parsed.values);
  if (error) return { error: error.message };

  revalidatePath("/");
  redirect("/");
}

export async function updateLote(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseLoteForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await supabaseServer.from("lotes").update(parsed.values).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/lotes/${id}`);
  redirect(`/lotes/${id}`);
}

export async function deleteLote(id: string) {
  const { error } = await supabaseServer.from("lotes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}
