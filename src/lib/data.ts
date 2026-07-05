import "server-only";
import { supabaseServer } from "./supabase-server";
import { calcularAnimalesVendidos, calcularTotales, Lote, LoteConTotales, Movimiento } from "./types";

export async function getLotesConTotales(filtros?: {
  desde?: string;
  hasta?: string;
}): Promise<LoteConTotales[]> {
  let movQuery = supabaseServer
    .from("movimientos")
    .select("lote_id, tipo, valor_total, categoria, cantidad");
  if (filtros?.desde) movQuery = movQuery.gte("fecha", filtros.desde);
  if (filtros?.hasta) movQuery = movQuery.lte("fecha", filtros.hasta);

  const [{ data: lotes, error: lotesError }, { data: movimientos, error: movError }] =
    await Promise.all([
      supabaseServer.from("lotes").select("*").order("fecha_ingreso", { ascending: false }),
      movQuery,
    ]);

  if (lotesError) throw new Error(lotesError.message);
  if (movError) throw new Error(movError.message);

  return (lotes ?? []).map((lote) => {
    const propios = (movimientos ?? []).filter((m) => m.lote_id === lote.id);
    const totales = calcularTotales(propios);
    const animales_vendidos = calcularAnimalesVendidos(propios);
    const animales_restantes = Math.max(0, lote.numero_animales - animales_vendidos);
    return { ...lote, ...totales, animales_vendidos, animales_restantes };
  });
}

export async function getLote(id: string): Promise<Lote | null> {
  const { data, error } = await supabaseServer.from("lotes").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getMovimientos(
  loteId: string,
  filtros?: { desde?: string; hasta?: string }
): Promise<Movimiento[]> {
  let query = supabaseServer
    .from("movimientos")
    .select("*")
    .eq("lote_id", loteId)
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (filtros?.desde) query = query.gte("fecha", filtros.desde);
  if (filtros?.hasta) query = query.lte("fecha", filtros.hasta);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getMovimientosFiltrados(filtros?: {
  loteId?: string;
  desde?: string;
  hasta?: string;
}): Promise<Movimiento[]> {
  let query = supabaseServer
    .from("movimientos")
    .select("*")
    .order("fecha", { ascending: false });

  if (filtros?.loteId) query = query.eq("lote_id", filtros.loteId);
  if (filtros?.desde) query = query.gte("fecha", filtros.desde);
  if (filtros?.hasta) query = query.lte("fecha", filtros.hasta);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export function getConsolidado(lotes: LoteConTotales[]) {
  return lotes.reduce(
    (acc, lote) => ({
      totalLotes: acc.totalLotes + 1,
      totalAnimales: acc.totalAnimales + (lote.numero_animales ?? 0),
      totalAnimalesRestantes: acc.totalAnimalesRestantes + lote.animales_restantes,
      totalGastos: acc.totalGastos + lote.total_gastos,
      totalIngresos: acc.totalIngresos + lote.total_ingresos,
      balance: acc.balance + lote.balance,
    }),
    {
      totalLotes: 0,
      totalAnimales: 0,
      totalAnimalesRestantes: 0,
      totalGastos: 0,
      totalIngresos: 0,
      balance: 0,
    }
  );
}
