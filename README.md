# Matrona Guía — Camila Rojas

Sitio de servicios de Matrona Camila Rojas, licenciada en Obstetricia y Puericultura con excelencia de la Universidad San Sebastián. Atención presencial en Ñuñoa, Santiago, y online para todo Chile.

El diseño actual adapta el último HTML Denta proporcionado: tarjetas grandes, botones circulares, filtros redondeados, detalles de atención y acceso a la agenda. Usa rosado y blanco, fuentes Inter locales y una distribución responsive. Los conceptos inmobiliarios y las pantallas de odontología no se muestran en la web.

## Desarrollo

React + TypeScript, Tailwind CSS y Vite. Requiere Node.js 20.19+, 22.12+ o una versión posterior compatible.

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
npm run build
npm run preview -- --port 4173
```

La compilación comprueba los tipos antes de generar la aplicación. `npm run typecheck` los comprueba por separado.

## Contenido confirmado

| Servicio presencial                    | Valor CLP | Condiciones                                    |
| -------------------------------------- | --------: | ---------------------------------------------- |
| Toma de PAP                            |   $20.000 | Incluye kit de muestra y entrega de resultados |
| Inserción de Implanon o Levoplant      |   $40.000 | Dispositivo no incluido                        |
| Inserción de DIU de cobre o Silverflex |   $40.000 | Dispositivo no incluido                        |
| Extracción de implante subdérmico      |   $35.000 | Atención presencial                            |
| Extracción de DIU                      |   $40.000 | Atención presencial                            |
| Inyectable IM o vacuna                 |   $15.000 | Solo administración, medicamento no incluido   |

Los datos, categorías y precios se mantienen en `src/content.js`. La duración, los horarios efectivos, la dirección exacta y los servicios/valores de consultas online no se han especificado. La atención online se consulta directamente por WhatsApp y no se ofrece como procedimiento virtual.

## Interacciones

- Filtros de exámenes, anticoncepción e inyectables, búsqueda sin sensibilidad a tildes y estado sin resultados.
- Detalles de cada servicio con valor y condiciones; agenda con la atención preseleccionada.
- Menú móvil con gestión de foco, preguntas desplegables y retorno al inicio.
- Efectos suaves que respetan la preferencia de movimiento reducido.

## Solicitud de cita

`src/Booking.jsx` recoge el motivo, la fecha y el horario preferidos y el nombre. Abre WhatsApp al **+56 9 7589 8382** con un mensaje preparado que incluye el valor y sus condiciones. La persona envía el mensaje y confirma la disponibilidad personalmente. No es una agenda de cupos en tiempo real; no procesa pagos ni guarda datos del formulario. El calendario toma el día actual de Chile continental.

## Fotografías

El usuario mostró tres fotografías reales de Camila y una lámina de precios en el chat. Las fotografías inline no llegaron al entorno como archivos descargables, por lo que todavía no se pueden copiar fielmente al proyecto. Se solicitó un ZIP con los originales.

`src/photos.ts` admite las tres imágenes y sus encuadres. Mientras sus rutas sean `null`, se utiliza un monograma floral con las iniciales de Camila, sin atribuirle otra fotografía. Los selectores de fotos solo aparecen cuando existen imágenes. Al recibir los archivos, copiarlos a `public/images/` y completar sus rutas en `photos.ts`; la exportación incluirá automáticamente los archivos utilizados.

## Exportación independiente

```sh
npm run export:html
```

Genera `exports/Matrona-Guia.html` con el código, fuentes e imágenes utilizadas incluidos. Se puede abrir sin instalar dependencias ni ejecutar un servidor. WhatsApp y las redes sociales requieren internet. El archivo descargable no constituye un alojamiento público.

Instagram: https://www.instagram.com/matronaguia/

TikTok: https://www.tiktok.com/@matronaguia
