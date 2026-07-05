import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-700 text-3xl">
            🐖
          </div>
          <h1 className="font-display text-3xl font-semibold text-green-900">Cochas</h1>
          <p className="mt-1 text-ink-soft">Control financiero de tu granja</p>
        </div>

        <form
          action={login}
          className="rounded-3xl border border-line bg-paper p-6 shadow-sm"
        >
          <input type="hidden" name="from" value={from ?? "/"} />
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">
            Clave de acceso
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            placeholder="Ingresa la clave"
            className="tap-target w-full rounded-xl border border-line bg-white px-4 text-lg text-ink outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          {error && (
            <p className="mt-3 rounded-lg bg-rust-100 px-3 py-2 text-sm font-medium text-rust-700">
              Clave incorrecta. Intenta de nuevo.
            </p>
          )}
          <button
            type="submit"
            className="tap-target mt-5 w-full rounded-xl bg-green-700 text-lg font-semibold text-white transition hover:bg-green-600 active:scale-[0.99]"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
