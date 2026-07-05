import Link from "next/link";
import { logout } from "@/app/login/actions";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-lg">
            🐖
          </span>
          <span className="font-display text-xl font-semibold text-green-900">Cochas</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-cream-dark"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
