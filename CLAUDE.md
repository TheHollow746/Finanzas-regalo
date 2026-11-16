# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

PWA de finanzas personales en **Soles Peruanos (S/)** para Arian²a, optimizada para celulares. Sin backend, sin build, sin npm: HTML5 + Tailwind CSS (CDN) + Chart.js (CDN) + `localStorage`. Estética minimalista inspirada en Pochacco.

## Archivos

- `index.html` — toda la app (HTML + `<script>` inline). Pestañas: Resumen (saldo, ingresos/gastos del mes, presupuesto, dona), Historial, Metas (alcancías), Respaldo.
- `manifest.json` — manifiesto PWA. `sw.js` — service worker (cache del app shell y CDN).
- `icon.svg`, `icon-192.png`, `icon-512.png` — iconos (carita de Pochacco sobre fondo menta).
- `PARA_MI_AMIGO.md` — guía breve para quien edite el mensaje de cumpleaños y publique la app.

## Ejecutar

El service worker solo funciona en `http://localhost` o HTTPS (no con `file://`). `index.html` sí se puede abrir con doble clic para ver la app, pero sin instalación ni modo offline. Si hay Python o Node: `python -m http.server 8080` / `npx serve`. (En esta máquina no están instalados.)

## Reglas

- UI en español, mobile-first (probar a 375px), con `safe-area` y `viewport-fit=cover`.
- Paleta (definida en `tailwind.config` dentro de `index.html`): crema `#FAF9F6` (fondo), tarjetas blancas con borde suave, menta `#34D399`/`#10B981` (ingresos, acentos), tinta `#1E293B` (texto/detalles), coral `#FB7185` (gastos). Fuente: Plus Jakarta Sans (Google Fonts). Estilo limpio: sin elementos invasivos al abrir la app.
- Sin dependencias fuera de los CDN de Tailwind, Chart.js y Google Fonts. No agregar bundlers ni frameworks.
- Moneda: formatear siempre con `Intl.NumberFormat('es-PE', {style:'currency', currency:'PEN'})` → `S/ 0.00` (helper `money()`). Montos guardados como números redondeados a 2 decimales, nunca como texto.
- Fechas ISO `YYYY-MM-DD`; los meses se filtran por prefijo `YYYY-MM`. No usar `new Date('YYYY-MM-DD')` para mostrar fechas (desfase de zona horaria); parsear manualmente.
- Claves de `localStorage`:
  - `finanzas_movimientos`: `[{id, type: 'income'|'expense', amount, description, category, date, account}]` (`account` = id de una cuenta)
  - `finanzas_cuentas`: `[{id, name, color, initial}]`. Siempre existe al menos una (por defecto "Efectivo", creada al cargar). Solo nombre, color y saldo inicial: nunca datos bancarios.
  - `finanzas_metas`: `[{id, name, target, saved}]`
  - `finanzas_presupuesto`: número (0 = sin presupuesto)
- Saldos: el saldo de una cuenta = `initial` + ingresos − gastos de sus movimientos (`saldoCuenta()`); el Saldo Total del Resumen es la suma de todas las cuentas. Al cargar, los movimientos sin cuenta válida se migran a la primera cuenta. Una cuenta no se puede eliminar si es la última o si tiene movimientos.
- Resumen: carrusel horizontal de cuentas bajo la tarjeta de saldo. La tarjeta de la dona tiene selector de periodo (Hoy / Semana lunes–domingo / Mes / Año, por defecto Mes) que recalcula dona, leyenda y total de esa tarjeta (`rangoPeriodo()`); las tarjetas "Ingresos/Gastos del Mes" y el presupuesto siguen siendo mensuales.
- El JSON de respaldo incluye `presupuesto`, `cuentas`, `movimientos` y `metas`; el CSV incluye la columna Cuenta.
- Las metas son alcancías **separadas**: abonar/retirar NO modifica el saldo del Resumen. Retirar no puede exceder lo ahorrado.
- Easter egg: 3 toques seguidos (<1.2 s) al perrito de la cabecera abren un modal con confeti. El texto vive en la constante `MENSAJE_CUMPLEANOS` al inicio del `<script>` de `index.html`; mantenerla ahí, arriba y comentada, porque un amigo la edita.
- Tema: modo día (crema `#FAF8F5`) / noche (`#161B22`) con `data-theme="dark"` en `<html>`; variables CSS `--cream`, `--card`, `--ink`. Se guarda en `localStorage['finanzas_tema']` (`'dark'` o `'light'`). Fondo con puntitos tipo bullet journal.
- Pochacco de la cabecera cambia a `#pocha-alerta` (gotita de sudor) cuando los gastos del mes ≥ 85 % del presupuesto. Metas al 100 % muestran el sello `STICKER`.
- Easter eggs extra: descripción con "helado", "pochacco" o "cumple" al guardar un movimiento (`EGGS`/`huellitas()`); toque al `2` de Arian²a abre un globo con `CHISTE_EXPONENTE` (constante editable arriba del `<script>`, junto a `MENSAJE_CUMPLEANOS`).
- `MENSAJE_CUMPLEANOS.mensaje` es código binario (se muestra en monoespaciada con botón "Copiar código"). El globo del `2` (`CHISTE_EXPONENTE = "1000011"`) sale con clic o long-press de 600 ms.
- Audio opcional `./intro.mpeg` (el usuario lo coloca en la carpeta): `introAudio()` lo intenta al cargar y, si hay bloqueo de autoplay, en el primer toque/clic; una vez por sesión (`sessionStorage['finanzas_intro_sonado']`). `sw.js` lo cachea de forma opcional y sirve respuestas 206 (Range) desde caché.
- El nombre se escribe `Arian<sup>2</sup>a` en HTML (y `Arian²a` en texto plano).
- Al modificar cualquier archivo cacheado (`index.html`, `manifest.json`, iconos), incrementar `CACHE_VERSION` en `sw.js` para que los clientes reciban la nueva versión.
- Escapar con `esc()` todo texto del usuario antes de insertarlo con `innerHTML`.
- Los PNG de iconos se generaron con PowerShell + `System.Drawing` dibujando la misma figura que `icon.svg` (no hay Python/Node/ImageMagick). Si se cambia el diseño del icono, actualizar los tres archivos.
