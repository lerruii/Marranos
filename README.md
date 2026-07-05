# 🐖 Cochas — Control financiero de granja porcina

Aplicación web para llevar el control financiero de los lotes (cochas) de marranos: gastos de
alimento (purina), medicinas y transporte, ingresos por venta de animales o grano, y el balance
de cada lote y del total de la granja.

Construida con **Next.js 16**, **Tailwind CSS 4** y **Supabase** (Postgres en la nube). Se puede
usar desde el celular, la tablet o el computador, y los datos quedan guardados en internet, no
solo en el navegador.

## Índice

- [¿Cómo se usa la app?](#cómo-se-usa-la-app)
- [1. Configurar la base de datos (Supabase)](#1-configurar-la-base-de-datos-supabase)
- [2. Configurar la clave secreta de acceso](#2-configurar-la-clave-secreta-de-acceso)
- [3. Correr la app en tu computador](#3-correr-la-app-en-tu-computador)
- [4. Subir el código a GitHub](#4-subir-el-código-a-github)
- [5. Publicar la app en internet (Vercel)](#5-publicar-la-app-en-internet-vercel)
- [6. Hacer cambios en el futuro](#6-hacer-cambios-en-el-futuro)
- [Exportar información](#exportar-información)
- [Seguridad](#seguridad)

## ¿Cómo se usa la app?

1. Al entrar, pide una **clave de acceso** (la que tú definas).
2. En la pantalla principal ves el **resumen general**: cuánto se ha invertido en total, cuánto
   han entrado en ventas, y el balance neto de toda la granja, más una tarjeta por cada lote.
3. Puedes **crear un lote** nuevo con el botón "+ Nuevo lote": nombre, fecha de nacimiento/ingreso,
   fecha de destete y número de animales.
4. Dentro de cada lote puedes **registrar gastos e ingresos** (compras de purina, medicinas,
   transporte, ventas de animales o de grano), con fecha, categoría, descripción, cantidad, valor
   unitario y valor total (si llenas cantidad y valor unitario, el total se calcula solo).
5. Puedes **filtrar** por rango de fechas (dentro de un lote y en el resumen general) y **buscar**
   lotes por nombre.
6. Puedes **exportar a CSV** (se abre en Excel) todos los movimientos o solo los de un lote.

## 1. Configurar la base de datos (Supabase)

Supabase es gratuito para este tamaño de proyecto.

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta (puedes usar tu cuenta de
   GitHub o Google).
2. Click en **New Project**. Elige:
   - Un nombre, por ejemplo `cochas`.
   - Una contraseña de base de datos (guárdala en un lugar seguro, aunque esta app no la
     necesita directamente).
   - La región más cercana a ti.
3. Espera 1-2 minutos mientras Supabase crea el proyecto.
4. Ve al menú **SQL Editor** (ícono de terminal, en la barra lateral) → **New query**.
5. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este repositorio, copia todo
   su contenido, pégalo en el editor y dale **Run**. Esto crea las tablas `lotes` y `movimientos`.
6. Ve a **Project Settings** (ícono de engranaje) y copia dos valores:
   - Pestaña **Data API** → **Project URL** → va en la variable `SUPABASE_URL`.
   - Pestaña **API Keys** → la llave **secret** (`sb_secret_...`, NO la `publishable`/`anon`) →
     va en `SUPABASE_SECRET_KEY`.

   ⚠️ La `secret key` da acceso total a la base de datos sin restricciones. Nunca la pongas en
   código que corre en el navegador ni la subas a GitHub — esta app solo la usa desde el
   servidor (por eso no lleva el prefijo `NEXT_PUBLIC_`).

## 2. Configurar la clave secreta de acceso

La app pide una clave simple antes de mostrar los datos (no es un sistema de usuarios). Se
configura con variables de entorno, nunca queda escrita en el código:

- `APP_PASSWORD`: la clave que vas a escribir en la pantalla de acceso. Elige algo que tú y las
  personas de confianza de la granja puedan recordar.
- `SESSION_SECRET`: una frase larga y aleatoria que usa la app internamente para firmar la sesión
  (no es algo que tengas que recordar ni escribir en ningún formulario).

## 3. Correr la app en tu computador

Necesitas [Node.js](https://nodejs.org) instalado (versión 20 o más reciente).

```bash
npm install
cp .env.example .env.local
```

Abre `.env.local` y completa las 4 variables (`APP_PASSWORD`, `SESSION_SECRET`,
`SUPABASE_URL`, `SUPABASE_SECRET_KEY`) con los valores de los pasos 1 y 2.

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — te pedirá la clave y luego verás el
resumen general.

## 4. Subir el código a GitHub

```bash
git add -A
git commit -m "Primera versión de Cochas"
```

Crea un repositorio vacío en [github.com/new](https://github.com/new) (sin README, sin
.gitignore — este proyecto ya los trae) y luego:

```bash
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## 5. Publicar la app en internet (Vercel)

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta con tu usuario de GitHub.
2. Click en **Add New → Project** y elige el repositorio que acabas de subir.
3. En **Environment Variables**, agrega las mismas 4 variables de tu `.env.local`:
   `APP_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`.
4. Click en **Deploy**. En un par de minutos tendrás una URL pública como
   `https://tu-proyecto.vercel.app`, accesible desde cualquier celular o computador con internet.

Con esto queda el **despliegue automático**: cada vez que hagas `git push` a la rama `main`,
Vercel vuelve a construir y publicar la app sola, sin que tengas que hacer nada más.

## 6. Hacer cambios en el futuro

1. Haz los cambios de código que necesites (tú mismo, o pídeselos a Claude Code).
2. Pruébalo localmente con `npm run dev`.
3. Sube los cambios:

   ```bash
   git add -A
   git commit -m "Descripción del cambio"
   git push
   ```

4. Vercel detecta el push y publica la nueva versión automáticamente en la misma URL.

Si en algún momento cambias la contraseña de acceso, actualiza `APP_PASSWORD` tanto en tu
`.env.local` como en las variables de entorno del proyecto en Vercel (Project → Settings →
Environment Variables) y vuelve a desplegar.

## Exportar información

- Desde el resumen general: botón **"Exportar todo (CSV)"** exporta los movimientos de todos
  los lotes (respetando el filtro de fechas activo, si hay alguno).
- Desde el detalle de un lote: botón **"Exportar CSV"** exporta solo los movimientos de ese lote.

El archivo `.csv` se abre directamente en Excel, Google Sheets o Numbers.

## Seguridad

- La clave de acceso y las credenciales de Supabase viven solo en variables de entorno
  (`.env.local` en tu computador, o la configuración de Vercel en producción) — nunca en el
  código fuente ni en el repositorio de GitHub.
- El navegador nunca habla directamente con Supabase: todas las lecturas y escrituras pasan por
  el servidor de la app, que es el único que conoce la `secret key`.
- Las tablas de la base de datos tienen Row Level Security (RLS) activado sin políticas
  públicas, así que aunque alguien obtuviera la URL del proyecto de Supabase, no podría leer ni
  modificar los datos sin la `secret key`.

## Estructura del proyecto

```
src/
  app/            Páginas y rutas (App Router de Next.js)
  components/     Componentes de interfaz reutilizables
  lib/            Acceso a datos, tipos, formato y autenticación
supabase/
  schema.sql      Esquema de la base de datos para pegar en Supabase SQL Editor
```
