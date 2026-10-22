# Matrona Guía

Sitio web responsive en español para orientación de salud femenina y solicitud de citas por WhatsApp.

## Desarrollo

Requiere Node.js 20.19+, 22.12+ o una versión compatible posterior (validado con Node.js 24).

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

```sh
npm run build
npm run preview -- --port 4173
```

Para crear un archivo HTML independiente, con fuentes, imágenes, videos y JavaScript incluidos:

```sh
npm run export:html
```

El archivo se guarda en `exports/Matrona-Guia.html`. No requiere un servidor para mostrar el sitio; los enlaces de WhatsApp y redes sociales sí requieren conexión a internet.

## Solicitudes de citas

El formulario recoge el motivo, la fecha y la franja horaria preferidos y el nombre. Prepara un mensaje y abre WhatsApp al **+56 9 7589 8382**. La persona debe enviar el mensaje y coordinar la confirmación directamente. No se muestran cupos en tiempo real, no se realiza un pago online y el sitio no almacena los datos del formulario.

Las fechas se habilitan según el día actual en Chile continental. Las franjas son preferencias, sujetas a confirmación.

## Contenido

- Instagram: https://www.instagram.com/matronaguia/
- TikTok: https://www.tiktok.com/@matronaguia
- La fotografía es una imagen ilustrativa generada para el sitio; no representa a la profesional.
- Los servicios se presentan como orientación general. Confirmar su alcance, la modalidad, el lugar de atención y los valores con la profesional antes de publicarlo como oferta definitiva.

No requiere claves, servicios externos ni base de datos para ejecutarse. Las fuentes y la imagen se sirven localmente.

## Portada con video vinculado al scroll

La portada `#inicio` permanece fija durante cuatro capítulos. El desplazamiento nativo controla la posición del video: al bajar avanza y al subir retrocede. Los botones de capítulo también permiten recorrerla y admiten las teclas de dirección, Inicio y Fin. El acceso a servicios permite saltar la portada; el botón para agendar permanece visible.

`src/ScrollFilm.jsx` calcula el progreso y actualiza `video.currentTime`, con un único seek en curso que siempre converge al último desplazamiento. No reproduce el video automáticamente ni utiliza sonido. Se selecciona un solo MP4 según el ancho de pantalla:

- `public/videos/scroll-film-desktop.mp4`: 1600 × 1000, 12 segundos.
- `public/videos/scroll-film-mobile.mp4`: 900 × 1200, 12 segundos.

Ambos clips son H.264, 24 fps, sin audio y preparados para búsquedas frecuentes (fotogramas clave cada 0,5 segundos, sin B-frames y con faststart). Muestran una composición animada de la fotografía ilustrativa; no son una grabación de la profesional. Sus posters están en `public/images/scroll-poster-*.jpg`.

Con `prefers-reduced-motion`, la portada se muestra estática, no descarga el MP4 y los botones cambian los mensajes sin desplazar la página. Si falla la carga del video, conserva la imagen y los botones en una portada estática. Se conservan los videos de presentación horizontal y vertical anteriores en `public/videos/`, aunque el rediseño utiliza los nuevos clips para el scroll.

## Diseño e interacciones

El diseño editorial combina blanco cálido, rosado, tipografía serif y una agenda accesible por teclado. El selector de servicios actualiza su descripción y abre la solicitud de cita con el motivo elegido. Incluye preguntas desplegables, navegación móvil, barra de progreso, aparición de secciones y acceso para agendar al terminar la portada. El botón para volver al inicio también devuelve el foco al contenido.

Los efectos respetan la preferencia de movimiento reducido. La implementación utiliza `requestAnimationFrame`, `IntersectionObserver` y `ResizeObserver`, sin una biblioteca de animación adicional.

La foto de perfil real de `@matronaguia` sigue pendiente: Instagram y TikTok no son accesibles desde la red de este entorno. El símbolo floral es la marca gráfica; no representa a la profesional.

La referencia solicitada es https://matronaguia.base44.app. Su contenido no se ha incorporado porque el acceso a ese dominio está bloqueado por la red del entorno. No se han atribuido a esa fuente valores, credenciales, dirección u otros datos sin verificar.
