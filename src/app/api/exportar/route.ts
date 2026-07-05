import { NextRequest, NextResponse } from "next/server";
import { getLote, getLotesConTotales, getMovimientosFiltrados } from "@/lib/data";
import { CATEGORIAS } from "@/lib/types";

function escapeCsv(value: string) {
  if (/[",\n;]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const loteId = searchParams.get("loteId") ?? undefined;
  const desde = searchParams.get("desde") ?? undefined;
  const hasta = searchParams.get("hasta") ?? undefined;

  const movimientos = await getMovimientosFiltrados({ loteId, desde, hasta });
  const lote = loteId ? await getLote(loteId) : null;

  const encabezado = [
    "Lote",
    "Fecha",
    "Tipo",
    "Categoria",
    "Descripcion",
    "Cantidad",
    "Valor unitario",
    "Valor total",
  ];

  let nombresLotes: Map<string, string>;
  if (lote) {
    nombresLotes = new Map([[lote.id, lote.nombre]]);
  } else {
    const todos = await getLotesConTotales();
    nombresLotes = new Map(todos.map((l) => [l.id, l.nombre]));
  }

  const filas = movimientos.map((m) =>
    [
      nombresLotes.get(m.lote_id) ?? "",
      m.fecha,
      m.tipo === "gasto" ? "Gasto" : "Ingreso",
      CATEGORIAS.find((c) => c.value === m.categoria)?.label ?? m.categoria,
      m.descripcion ?? "",
      m.cantidad?.toString() ?? "",
      m.valor_unitario?.toString() ?? "",
      m.valor_total.toString(),
    ]
      .map((v) => escapeCsv(String(v)))
      .join(";")
  );

  const csv = ["﻿" + encabezado.join(";"), ...filas].join("\r\n");

  const nombreArchivo = lote
    ? `cochas-${lote.nombre.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`
    : "cochas-todos-los-lotes.csv";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
