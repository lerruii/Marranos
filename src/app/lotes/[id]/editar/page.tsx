import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { LoteForm } from "@/components/LoteForm";
import { getLote } from "@/lib/data";
import { updateLote } from "../../actions";

export default async function EditarLotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lote = await getLote(id);
  if (!lote) notFound();

  const action = updateLote.bind(null, id);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
        <Link href={`/lotes/${id}`} className="text-sm font-medium text-ink-soft hover:text-ink">
          ← Volver al lote
        </Link>
        <h1 className="font-display mt-2 mb-6 text-2xl font-semibold text-green-900">
          Editar {lote.nombre}
        </h1>
        <LoteForm action={action} lote={lote} submitLabel="Guardar cambios" />
      </main>
    </>
  );
}
