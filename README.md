# GranaBank

Billetera del Club Atlético Lanús, hecha a partir del diseño en Figma: tarjetas con su saldo, movimientos con búsqueda y filtros, y el detalle de cada movimiento.

- **Deploy:** https://granabank.vercel.app
- **Usuario de prueba:** `soygranate@clublanus.com` / `GRANATE1@`

## Cómo correrlo

Requisitos: **Node.js 20.19+** y **PostgreSQL** con la extensión `unaccent` (incluida en Neon y en las instalaciones estándar).

1. Copiar `.env.example` a `.env` y completar `DATABASE_URL`, `DATABASE_URL_UNPOOLED` (con un Postgres local, la misma URL) y `SESSION_SECRET` (cualquier texto largo y aleatorio).
2. Instalar, crear las tablas, cargar los datos de prueba y levantar la app en http://localhost:3000:
   ```bash
   npm install
   npx prisma migrate deploy
   npm run db:seed
   npm run dev
   ```

> El seed borra y vuelve a crear todos los datos de la base a la que apunta `.env`.

## Decisiones técnicas

- **Stack:** Next.js 16 con API routes como backend (un solo proyecto y un solo deploy), TypeScript, PostgreSQL en Neon, Prisma, Tailwind + shadcn/ui y zod. Deploy en Vercel con cada merge a `main`.
- **Login propio:** contraseña hasheada con bcrypt y sesión en una cookie `httpOnly` firmada. "Recordarme" la mantiene 30 días; sin tildar, se cierra con el navegador.
- **Las pantallas leen la base en el servidor**, a través de una capa de acceso que siempre filtra por el usuario logueado.
- **Montos en centavos enteros**, para evitar errores de redondeo.
- **El saldo cuenta solo los movimientos completados:** lo pendiente todavía no se procesó y lo rechazado nunca salió.
- **Búsqueda sin tildes** ("jose" encuentra "José") con la extensión `unaccent` de Postgres. Búsqueda y filtro viven en la URL, así sobreviven a recargar.
- **Las reglas de los datos se validan también en la base**, con restricciones `CHECK`, no solo en el código.
- **El usuario nunca ve un código de error:** la API responde con un código estable y la pantalla elige un mensaje que diga qué hacer.
- **Detalle del movimiento:** no estaba en el Figma; se diseñó con su mismo lenguaje visual.
- **Estados del movimiento** (completado, pendiente, rechazado): en las listas solo se marcan los dos últimos, para que las filas completadas queden como en el Figma.

## Qué mejoraría con más tiempo

- Crear movimientos desde la API, actualizando el saldo en la misma transacción.
- Notificaciones reales (hoy la pantalla está siempre vacía).
- Comprobante del movimiento para compartir o descargar.
- Motivo del rechazo en el detalle.
- Color por tarjeta en vez de por marca.
- Volver a la pantalla pedida después del login.
- Tests de la lógica de datos y de los flujos principales.
