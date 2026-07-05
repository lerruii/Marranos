import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error(
    "Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_SECRET_KEY. Revisa tu archivo .env.local."
  );
}

// Cliente con la clave secreta (sb_secret_...): solo debe usarse en Server
// Components, Server Actions y Route Handlers. Nunca importar este archivo
// desde un componente cliente ("use client").
export const supabaseServer = createClient(url, secretKey, {
  auth: { persistSession: false },
});
