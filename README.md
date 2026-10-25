# Matrona Guía — Camila Rojas Torres

Web de servicios de la matrona Camila Rojas Torres, Universidad San Sebastián 2024 con Distinción Máxima. Atención presencial en Carmen Covarrubias 32, Ñuñoa, los viernes de 10:00 a 16:00, y online para todo Chile.

## Ejecutar

Requiere Node.js 24 para el almacenamiento SQLite integrado.

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

El comando inicia Vite y la API en `127.0.0.1:3001`. Vite deriva `/api` a esa API. Para compilar y revisar el resultado:

```sh
npm run build
npm start
```

`npm run build` comprueba TypeScript antes de compilar. `npm run typecheck` ejecuta solo la comprobación. `npm start` sirve el resultado compilado en el puerto 4173 y arranca la API.

## Portada

`src/HeroSection.tsx` concentra la portada a pantalla completa, navegación, menú móvil con gestión de foco y animaciones de entrada. Adapta la referencia visual al nombre y los rosados de Matrona Guía. Usa Inter (pesos 300–700) servido localmente, así como las tipografías de la marca para el logotipo tipográfico.

El fondo utiliza los MP4 locales de maternidad para escritorio y móvil. Se reproducen silenciados y en bucle; se pausan al salir de pantalla, abrir el menú o la agenda, ocultar la pestaña o activar el control de pausa. La preferencia de movimiento reducido evita descargar el MP4 y presenta su poster. El fondo se adapta al 70% inferior de la pantalla en móvil. Si falla la carga, permanece visible el poster.

El video dental externo, la figura de Figma, las imágenes de Pexels y Google Fonts del ejemplo no son accesibles desde la red del entorno. Se usaron medios locales adecuados para Matrona Guía y la misma fuente Inter incluida en el proyecto. No se trasladaron las estadísticas ficticias del ejemplo a Camila.

## Contenido e interacciones

- Catálogo de 11 áreas con filtros y búsqueda sin sensibilidad a tildes.
- Valores de 19 prestaciones en tres grupos: online, presencial y procedimientos.
- Agenda con modalidad y servicio preseleccionados, valores y condiciones en el mensaje de WhatsApp.
- Preferencias presenciales los viernes de 10:00 a 16:00; fechas y franjas online sujetas a coordinación. No representa cupos en tiempo real.
- Política confirmada: online se paga el valor completo; presencial y procedimientos se reservan con abono de $10.000. Los pagos y sus datos se coordinan por WhatsApp; la web no cobra ni simula transferencias.
- Cancelaciones y cambios con 2 días hábiles de anticipación.
- Ubicación, mapa bajo demanda, redes sociales, correo y acceso a WhatsApp.
- Tres artículos educativos en modales y dos guías PDF reales de dos páginas.
- Formulario de contacto y experiencias con consentimiento y validación.

Los datos se mantienen en `src/content.js`. El material educativo está en `src/education-content.ts` y `public/resources/`. Los procedimientos conservan sus exclusiones: inserciones sin dispositivo, inyectable solo administración sin medicamento, PAP con kit y entrega de resultados.

## Formularios y moderación

La API (`server/api.mjs`) guarda contactos y experiencias en SQLite. Las experiencias se guardan como pendientes y el listado público devuelve solo las aprobadas. No se han inventado testimonios de pacientes ni se envían correos automáticamente.

La base de datos está en `.data/matronaguia.sqlite`, excluida de Git. Se puede elegir otra ruta con `MATRONAGUIA_DB`. La moderación se realiza desde la terminal del propietario, sin un endpoint administrativo público:

```sh
node server/moderate.mjs contacts
node server/moderate.mjs list
node server/moderate.mjs publish ID
node server/moderate.mjs reject ID
```

## Fotografías y marca

El retrato original de Camila, recibido dentro del ZIP, se usa en la presentación y los avatares. Su archivo se conserva sin modificaciones en `public/images/retrato-camila-rojas.jpeg`. Las seis ilustraciones del ZIP se conservan como material visual ilustrativo.

La nueva foto con uniforme negro y el logotipo enviados inline aún necesitan sus archivos descargables para incorporarlos fielmente. Mientras llegan, la cabecera reproduce el nombre y la firma con tipografía, y utiliza la fotografía original ya disponible. Las rutas del retrato y las ilustraciones están en `src/photos.ts`.

## Archivo independiente

```sh
npm run export:html
```

Genera `exports/Matrona-Guia.html` con fuentes, videos, imágenes y PDFs incluidos. Se abre sin instalar dependencias ni ejecutar un servidor. En esta versión descargable los formularios preparan mensajes de WhatsApp y lo indican expresamente; no afirman guardar en una base de datos que el archivo no tiene. El almacenamiento SQLite funciona al ejecutar la aplicación con su API.

Los enlaces de WhatsApp, mapa, correo y redes requieren conexión. La descarga no constituye un alojamiento público de la web.
