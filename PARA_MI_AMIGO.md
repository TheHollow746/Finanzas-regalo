# Para mi amigo 👋

Esta es una app de finanzas personales (en Soles) hecha con HTML puro. No necesitas instalar nada para editarla.

## Cómo editar el mensaje de cumpleaños

1. Abre `index.html` con cualquier editor de texto (Bloc de notas, VS Code…).
2. Busca (Ctrl + F) `MENSAJE_CUMPLEANOS`. Está al inicio de la etiqueta `<script>`, con un comentario encima.
3. Cambia **solo** los textos entre comillas:

```js
const MENSAJE_CUMPLEANOS = {
  titulo: "¡Feliz cumpleaños, Arian²a!",
  mensaje: "Tu mensaje aquí.\nUsa \n para un salto de línea.",
  firma: "Con cariño, tu amigo"
};
```

4. Guarda el archivo. Cuida no borrar las comillas ni las comas.

## Cómo probarlo

- Abre `index.html` (doble clic) y **toca 3 veces seguidas el perrito** junto a "Hola, Arian²a". Saldrá la tarjeta con confeti.
- Para probar la instalación en el celular y el modo sin internet se necesita HTTPS (ver abajo).

## Cómo subirla para que ella la use

Cualquiera de estas opciones es gratis y sirve (todas dan HTTPS):

- **Netlify Drop**: entra a <https://app.netlify.com/drop> y arrastra la carpeta completa del proyecto.
- **GitHub Pages**: sube los archivos a un repositorio y activa *Settings → Pages*.
- **Vercel**: importa la carpeta o el repositorio.

Luego, en el celular abre el enlace con Chrome (Android: menú ⋮ → *Instalar app*) o Safari (iPhone: Compartir → *Añadir a pantalla de inicio*).

## Importante al actualizar

Después de cambiar el mensaje (o cualquier archivo), abre `sw.js` y sube el número de la primera línea: `const CACHE_VERSION = 'v4';` → `'v5'` (siempre un número más que el actual). Así el teléfono descarga la versión nueva en vez de mostrar la anterior.

Los datos (movimientos, metas, presupuesto) se guardan solo en el teléfono de ella; la pestaña **Respaldo** permite exportarlos a CSV/JSON.
