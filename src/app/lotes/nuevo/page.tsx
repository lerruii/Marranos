import Link from "next/link";
import { Header } from "@/components/Header";
import { LoteForm } from "@/components/LoteForm";
import { createLote } from "../actions";

export default function NuevoLotePage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <Link href="/" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← Volver al resumen
        </Link>
        <h1 className="font-display mt-2 mb-6 text-2xl font-semibold text-green-900">
          Nuevo lote / cocha
        </h1>
        <LoteForm action={createLote} submitLabel="Crear lote" />
      </main>
    </>
  );
}
