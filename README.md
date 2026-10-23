# Matrona Guía

Landing responsive en español con React, TypeScript, Tailwind CSS y Vite. La experiencia visual del texto de referencia se adapta a Matrona Guía, sus colores rosados y blancos y sus contenidos de salud femenina.

## Desarrollo

Requiere Node.js 20.19+, 22.12+ o una versión compatible posterior.

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
npm run build
npm run preview -- --port 4173
```

`npm run build` comprueba los tipos con TypeScript antes de generar la aplicación. `npm run typecheck` ejecuta esa comprobación por separado.

## Experiencia

- Introducción con escritura del nombre y cortina ascendente. Se puede saltar y aparece una sola vez por sesión.
- Portada con tipografía Syne, video en arco y entrada desde abajo. El scroll desplaza y escala la composición; controla también `video.currentTime`, con avance e inversa y una única búsqueda de fotograma en curso.
- Sección fija con fondo ciruela, navegación que cambia de color y contadores de cuatro áreas, tres pasos y una conversación. Son descripciones del sitio, no estadísticas de pacientes ni credenciales.
- Galería de cinco videos locales que se expande con el ratón o el teclado en escritorio y usa dos columnas en móvil. Incluye pausa y selección por toque. Se carga al acercarse a la pantalla y se pausa al abrir la agenda, ocultar la pestaña o salir de la sección.
- Servicios seleccionables, cuatro preguntas desplegables, menú completo y solicitud de cita por WhatsApp.

El desplazamiento sigue siendo nativo. Los efectos usan React, `requestAnimationFrame`, `IntersectionObserver` y `ResizeObserver`, sin bibliotecas de animación. `src/App.tsx` contiene la experiencia y sus animaciones; `src/Booking.jsx` conserva el formulario y su gestión de foco. Tailwind se configura mediante `vite.config.ts`. Las fuentes Syne e Inter se sirven localmente para que la descarga funcione sin depender de Google Fonts.

Con movimiento reducido no aparecen la introducción ni la portada fija, no se descargan los MP4 y se muestran los posters. Si falla el video principal, se conserva una portada estática con su imagen. El diseño también admite pantallas apaisadas de poca altura.

## Solicitudes de citas

El formulario recoge motivo, fecha y horario preferidos y nombre. Abre WhatsApp al **+56 9 7589 8382** con un mensaje preparado. La persona envía el mensaje y confirma personalmente la disponibilidad, modalidad y valor. No ofrece cupos en tiempo real, no realiza pagos ni almacena datos. El calendario utiliza el día actual en Chile continental.

## Descarga independiente

```sh
npm run export:html
```

Genera `exports/Matrona-Guia.html` con código, fuentes, imágenes y videos incluidos. El ZIP entregable contiene este HTML e instrucciones para abrirlo. No requiere instalar dependencias ni ejecutar un servidor. Los enlaces de WhatsApp y redes sociales requieren conexión a internet. La descarga no constituye un alojamiento público.

## Contenido y medios

- Instagram: https://www.instagram.com/matronaguia/
- TikTok: https://www.tiktok.com/@matronaguia
- Videos de portada: `public/videos/scroll-film-{desktop,mobile}.mp4`, H.264, 12 segundos, sin audio, con fotogramas clave frecuentes para el scroll.
- Galería: `public/videos/gallery-{1..5}.mp4` y sus posters, cinco bucles de cuatro segundos sin audio, 0,84 MB en total.
- Las composiciones muestran una fotografía ilustrativa generada, no una grabación ni un retrato de la profesional. Su foto real no se ha podido obtener desde Instagram o TikTok por las restricciones de red del entorno.
- Los servicios se presentan como orientación general. Su alcance, lugar, modalidad y valores se coordinan con la profesional.

Los medios inmobiliarios, el nombre Velar y las estadísticas comerciales del texto de referencia no se utilizan en Matrona Guía. El contenido de https://matronaguia.base44.app no se ha incorporado porque ese dominio no es accesible desde la red del entorno.
