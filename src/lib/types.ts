export type TipoMovimiento = "gasto" | "ingreso";

export type CategoriaMovimiento =
  | "purina"
  | "medicina"
  | "transporte"
  | "venta_grano"
  | "venta_animal"
  | "otro";

export const CATEGORIAS: { value: CategoriaMovimiento; label: string; tipo: TipoMovimiento | "ambos" }[] = [
  { value: "purina", label: "Purina / alimento", tipo: "gasto" },
  { value: "medicina", label: "Medicina", tipo: "gasto" },
  { value: "transporte", label: "Transporte", tipo: "gasto" },
  { value: "venta_grano", label: "Venta de grano", tipo: "ingreso" },
  { value: "venta_animal", label: "Venta de animal", tipo: "ingreso" },
  { value: "otro", label: "Otro", tipo: "ambos" },
];

export interface Lote {
  id: string;
  nombre: string;
  fecha_ingreso: string;
  fecha_destete: string | null;
  numero_animales: number;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Movimiento {
  id: string;
  lote_id: string;
  fecha: string;
  tipo: TipoMovimiento;
  categoria: CategoriaMovimiento;
  descripcion: string | null;
  cantidad: number | null;
  valor_unitario: number | null;
  valor_total: number;
  created_at: string;
}

export interface LoteConTotales extends Lote {
  total_gastos: number;
  total_ingresos: number;
  balance: number;
}

export function calcularTotales(movimientos: Pick<Movimiento, "tipo" | "valor_total">[]) {
  let total_gastos = 0;
  let total_ingresos = 0;
  for (const m of movimientos) {
    if (m.tipo === "gasto") total_gastos += Number(m.valor_total);
    else total_ingresos += Number(m.valor_total);
  }
  return { total_gastos, total_ingresos, balance: total_ingresos - total_gastos };
}
