-- Esquema de base de datos para "Cochas - Control financiero de granja porcina".
-- Copia y pega TODO este archivo en Supabase > SQL Editor > New query > Run.

create extension if not exists "pgcrypto";

-- Tabla de lotes (cochas)
create table if not exists public.lotes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  fecha_ingreso date not null,
  fecha_destete date,
  numero_animales integer not null default 0,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla de movimientos (gastos e ingresos) de cada lote
create table if not exists public.movimientos (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid not null references public.lotes (id) on delete cascade,
  fecha date not null,
  tipo text not null check (tipo in ('gasto', 'ingreso')),
  categoria text not null check (
    categoria in ('purina', 'medicina', 'transporte', 'venta_grano', 'venta_animal', 'otro')
  ),
  descripcion text,
  cantidad numeric,
  valor_unitario numeric,
  valor_total numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists movimientos_lote_id_idx on public.movimientos (lote_id);
create index if not exists movimientos_fecha_idx on public.movimientos (fecha);

-- Mantiene lotes.updated_at al día en cada edición
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists lotes_set_updated_at on public.lotes;
create trigger lotes_set_updated_at
  before update on public.lotes
  for each row execute function public.set_updated_at();

-- Seguridad: se habilita RLS y NO se crean políticas para los roles públicos
-- (anon / authenticated). La aplicación solo accede a estas tablas desde el
-- servidor usando la clave "service_role", que ignora RLS. Así, aunque algún
-- día se exponga por error la URL del proyecto, nadie puede leer ni escribir
-- estas tablas directamente desde el navegador.
alter table public.lotes enable row level security;
alter table public.movimientos enable row level security;
