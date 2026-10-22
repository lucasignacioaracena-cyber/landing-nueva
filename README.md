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

Para crear un archivo HTML independiente, con fuentes, imágenes, videos, subtítulos y JavaScript incluidos:

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

## Videos de presentación

La sección `#presentacion` reproduce los dos MP4 locales de `public/videos/`, con selector horizontal/vertical, controles nativos, botones de reproducción y sonido y acceso directo al formulario de citas. Los videos se cargan al reproducirlos y se pausan al salir de pantalla, cambiar de formato, ocultar la pestaña o abrir la agenda. No hay reproducción automática.

Incluye una transcripción desplegable y subtítulos en español (`presentacion-es.vtt`). La música es instrumental original y los videos no contienen voz en off. Sus fotografías son ilustrativas.

La foto de perfil real de `@matronaguia` sigue pendiente: Instagram y TikTok no son accesibles desde la red de este entorno. El símbolo floral del perfil es la marca gráfica; no se ha usado una fotografía de otra persona para representar a la profesional.

## Scroll interactivo

La página incorpora una barra de avance de lectura, navegación que indica la sección actual, aparición progresiva de contenido, parallax suave en la portada y un indicador de avance en los pasos de la cita. En celulares, el acceso para agendar aparece al terminar la portada. El botón para volver al inicio devuelve también el foco al contenido.

Se conserva el desplazamiento nativo del navegador. Los efectos respetan `prefers-reduced-motion`, no requieren nuevas dependencias y usan `requestAnimationFrame` e `IntersectionObserver`.

La referencia solicitada es https://matronaguia.base44.app. Su contenido todavía no se ha incorporado: el acceso a ese dominio está bloqueado por la red del entorno. Habilitarlo antes de atribuir a esa fuente servicios, valores, credenciales, dirección u otros datos.
