# GranaBank

Billetera del Club Atlético Lanús: tarjetas con su saldo, últimos movimientos, búsqueda y filtros, y el detalle de cada movimiento. Challenge técnico para la pasantía de Product Manager, hecho a partir del diseño en Figma.

- **Deploy:** https://granabank.vercel.app
- **Usuario de prueba:** `soygranate@clublanus.com` / `GRANATE1@`

## Cómo correrlo en local

Hace falta **Node.js 20.19 o superior** y una base **PostgreSQL** con la extensión `unaccent`. Viene incluida en Neon y en las instalaciones estándar de Postgres.

1. Instalar dependencias. También genera el cliente de Prisma:
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env` y completar:
   - `DATABASE_URL`: la conexión que usa la app. En Neon, la *pooled*.
   - `DATABASE_URL_UNPOOLED`: la conexión directa, que usa Prisma para migrar. Con un Postgres local, las dos son la misma URL.
   - `SESSION_SECRET`: cualquier texto largo y aleatorio. Firma la cookie de sesión.
3. Crear las tablas y cargar los datos de prueba:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
4. Levantar la app en http://localhost:3000:
   ```bash
   npm run dev
   ```

> **Ojo con el seed:** borra y vuelve a crear todos los datos de la base a la que apunta `.env`, y cierra las sesiones abiertas. No correrlo contra una base con datos que importen.

Otros comandos: `npm run lint`, `npm run db:studio` (explorar la base) y `npm run build`.

## Stack

| Pieza | Por qué |
|---|---|
| **Next.js 16** (App Router) + **TypeScript** | Front y back en un solo proyecto y un solo deploy. Las pantallas leen datos en el servidor. |
| **API routes de Next.js** | Alcanzan para el login y el logout; no hace falta un servidor aparte. |
| **PostgreSQL** en **Neon** | Relacional, como pide la consigna, y se integra con Vercel en un par de clics. |
| **Prisma 7** | El esquema se lee como documentación y las migraciones quedan versionadas y se aplican solas en cada deploy. |
| **Tailwind CSS v4** + **shadcn/ui** | Componentes accesibles de base (botones, inputs, carrusel) que se adaptan al estilo del Figma. |
| **zod** | Una sola validación, compartida entre el formulario y la API. |
| **Vercel** | Deploy automático con cada merge a `main`. |

## Decisiones técnicas

- **Login propio**, sin librería de autenticación: la contraseña se guarda hasheada (bcrypt) y la sesión es un token firmado en una cookie `httpOnly`. Para un solo usuario de prueba, una librería completa era más de lo necesario.
- **"Recordarme"**: tildado, la sesión dura 30 días; sin tildar, se cierra con el navegador (y como máximo a las 12 horas).
- **La sesión se verifica en el servidor** en cada pantalla, no solo con la redirección inicial. Si el usuario ya no existe, se lo saca.
- **Las pantallas leen la base directamente en el servidor**, a través de una capa de acceso (`src/lib/dal.ts`). Toda consulta filtra por el usuario logueado: el movimiento de otro usuario da el mismo "no encontrado" que uno que no existe.
- **Montos en centavos enteros**, para no tener errores de redondeo con decimales.
- **El saldo de cada tarjeta se guarda en la base** y el seed lo calcula como la suma de sus movimientos. **Cuenta solo los completados:** lo pendiente todavía no se procesó y lo rechazado nunca salió.
- **Búsqueda sin tildes:** "jose" encuentra "José". Usa la extensión `unaccent` de Postgres; es la única consulta escrita en SQL, con los valores como parámetros.
- **Búsqueda y filtro viven en la URL** (`/movements?q=jose&type=CASH_IN`): sobreviven a recargar, se pueden compartir y se validan antes de usarse.
- **Las reglas de los datos se validan en la base**, no solo en el código: el tipo de operación tiene que cuadrar con el movimiento y el CUIT/CUIL tiene 11 dígitos y solo va en transferencias.
- **Al usuario nunca se le muestra un código de error:** la API responde con un código estable (`INVALID_CREDENTIALS`, `SERVER_ERROR`) y la pantalla elige un mensaje que diga qué hacer.

## Lo que el Figma no definía

El Figma trae Login, Home y Movimientos. Lo que faltaba se resolvió con el mismo lenguaje visual:

- **Detalle del movimiento:** la consigna lo pide y el Figma no lo tiene. Muestra el ícono, la contraparte, el monto y el estado, más el tipo de operación, la fecha y la hora, el concepto, el CUIT/CUIL (transferencias), la tarjeta (egresos) y el número de operación. La flecha vuelve a la pantalla anterior con su búsqueda y su filtro.
- **Estados de los movimientos:** completado, pendiente y rechazado. En las listas, solo se marcan los dos últimos, con su palabra y su ícono (reloj de arena o X), así las filas completadas quedan como en el Figma.
- **Campana de notificaciones:** lleva a una pantalla de notificaciones vacía. Las notificaciones reales necesitan algo que las genere (ver más abajo).
- **Segunda tarjeta asomando en la Home:** es un carrusel. Los últimos movimientos son los de la tarjeta que está en pantalla y cambian al deslizar.
- **Montos:** en pesos, con dos decimales (`$ 978,85`). Llevan "+" o "−" según entre o salga plata, y solo los ingresos van en color (verde).
- **Carga, error y vacío:** siluetas con la forma de cada pantalla mientras carga; "No pudimos cargar tus datos" con "Reintentar" si algo falla; mensajes propios cuando no hay movimientos o la búsqueda no encuentra nada.

## Estructura

```
prisma/
  schema.prisma       Modelo de datos: usuario, tarjetas y movimientos
  migrations/         Migraciones versionadas (se aplican en cada deploy)
  seed.ts             Datos de prueba
src/
  app/
    (app)/            Pantallas con barra inferior: Home y Movimientos
    movements/[id]/   Detalle del movimiento
    notifications/    Notificaciones
    login/            Login
    api/auth/         Login y logout
  components/         Componentes compartidos (tarjeta, carrusel, fila de movimiento, ui/ de shadcn)
  lib/                Acceso a datos, sesión, validaciones y formatos
  proxy.ts            Redirige al login si no hay sesión
```

## Qué mejoraría con más tiempo

- **Crear movimientos** desde la API, con el movimiento y el cambio de saldo en una sola transacción y un descuento que no deje el saldo negativo si llegan dos pagos a la vez.
- **Notificaciones reales**, generadas cuando se recibe un pago o se rechaza uno.
- **Comprobante** del movimiento para compartir o descargar.
- **Motivo del rechazo** en el detalle ("Saldo insuficiente", "Tarjeta bloqueada").
- **Color por tarjeta** guardado en la base, en vez de por marca: hoy dos tarjetas de la misma marca se verían iguales.
- **Volver a la pantalla pedida después del login**, si se abrió un link sin sesión.
- **Tests** de la lógica de datos y de los flujos principales.

## Uso de IA

Usé **Claude Code** para escribir el código. El trabajo se organizó así:

- **Antes de tocar código**, cada cambio se presentaba como una lista de qué se iba a hacer, y yo lo aprobaba, lo ajustaba o lo descartaba.
- **Las decisiones de producto fueron mías**: qué mostrar en el detalle, cómo marcar los estados de un movimiento, qué quedaba afuera y qué componentes valía la pena armar. Varias propuestas se descartaron por ser más de lo que el challenge necesitaba.
- **Probé cada funcionalidad** en el deploy de prueba de Vercel antes de integrarla a `main` por Pull Request.
- **Las decisiones quedaron documentadas** en este README y en los mensajes de commit, para poder explicar qué se hizo y por qué.
