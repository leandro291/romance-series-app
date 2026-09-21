# Diseño de referencia — RomanceTV Catálogo Sakura

Modelo para la refactorización. Copia del canvas: https://claude.ai/artifact/MmkZ3CvHHkCYZftwzzvTDD

- `Main.dc.html` — catálogo escritorio (hero + árbol de cerezo, búsqueda, grilla, cargar más, modal).
- `Estados.dc.html` — carga, error de API, búsqueda sin resultados, cargar más / fin.
- `Movil.dc.html` — layout 390 px.
- `canvas.json` — índice del canvas.

Formato `.dc.html` (runtime del canvas): no se abre directo en el navegador. Sirve como
referencia de markup, CSS (clases y keyframes en `<helmet><style>`) y la lógica del árbol
(`tree()` en el `<script data-dc-script>`). Datos y pósters son de ejemplo.
