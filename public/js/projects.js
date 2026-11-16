/* Contenido de los proyectos. Cada texto: [es, en]. Datos de las demos: inventados. */
window.CHAPTERS = [
  {
    id: 'origen',
    eyebrow: ['El origen', 'Where it started'],
    title: ['El primer proyecto que hice con IA. <em>Todo lo demás salió de acá.</em>', 'The first thing I built with AI. <em>Everything else came from here.</em>'],
    intro: [
      'Arrancó con una necesidad de todos los días: desbloquear una planilla, unir dos PDFs, achicar un video, sin subir documentos de trabajo a sitios de terceros. Fue lo primero que construí con Claude, y lo que me mostró que podía hacer yo mismo las herramientas que necesitaba.',
      'It started with an everyday need: unlock a spreadsheet, merge two PDFs, shrink a video, without uploading work documents to third-party sites. It was the first thing I built with Claude, and what showed me I could make the tools I needed myself.'
    ],
    rows: [['kit']]
  },
  {
    id: 'trabajo',
    eyebrow: ['En el trabajo', 'At work'],
    title: ['Finanzas y operaciones: <em>donde la planilla ya no alcanzaba.</em>', 'Finance and operations: <em>where the spreadsheet ran out.</em>'],
    intro: [
      'Herramientas internas para equipos de cuentas a pagar y de operaciones de viajes. Las restricciones eran reales: PCs corporativas sin permisos de administrador, sin servidores, sin Node. Los nombres de empresa, de sistemas y los datos quedaron afuera a propósito.',
      'Internal tools for accounts payable and travel operations teams. The constraints were real: locked-down corporate PCs, no servers, no Node. Company names, system names and data are left out on purpose.'
    ],
    rows: [['conc'], ['batch'], ['sched', 'gantt']]
  },
  {
    id: 'productos',
    eyebrow: ['Productos', 'Products'],
    title: ['Cosas que resuelven un problema entero, <em>de punta a punta.</em>', 'Things that solve a whole problem, <em>end to end.</em>'],
    intro: [
      'Tres son open source y se pueden instalar hoy. Las otras dos corren en producción para equipos chicos, con IA aplicada a un problema concreto y no al revés.',
      'Three are open source and installable today. The other two run in production for small teams, with AI applied to a concrete problem rather than the other way round.'
    ],
    rows: [['invisi'], ['hand'], ['vault'], ['down'], ['portal']]
  },
  {
    id: 'madrugada',
    eyebrow: ['De madrugada', 'After hours'],
    title: ['Juego, familia <em>y experimentos.</em>', 'Play, family <em>and experiments.</em>'],
    intro: [
      'Lo que se construye cuando nadie lo pide. Acá aparece la parte gráfica: flood fill, SVG procedural, síntesis de audio, orden por color.',
      'What gets built when nobody asks for it. This is where the graphics live: flood fill, procedural SVG, audio synthesis, sorting by colour.'
    ],
    rows: [['zap'], ['color'], ['fashion', 'music'], ['murmur'], ['iee', 'also']]
  }
];

window.PROJECTS = {
  kit: {
    skin: 's-kit', short: ['Pals Toolkit', 'Pals Toolkit'],
    kind: ['Origen · Web', 'Origin · Web'],
    live: 'https://pals-toolkit.web.app',
    name: ['Pals Toolkit', 'Pals Toolkit'],
    tagline: [
      'Dieciséis herramientas de oficina en una sola página: desbloquear planillas, unir y comprimir PDFs, convertir videos e imágenes. Los archivos nunca salen de tu computadora.',
      'Sixteen office tools on a single page: unlock spreadsheets, merge and compress PDFs, convert videos and images. Your files never leave your computer.'
    ],
    how: [
      'Un único archivo HTML, sin backend: todo el procesamiento ocurre en el navegador. Tiene nueve temas visuales, de un editorial color hueso a una terminal verde, porque una herramienta propia también puede ser divertida de usar.',
      'A single HTML file with no backend: all the processing happens in the browser. It has nine visual themes, from bone-coloured editorial to a green terminal, because a tool of your own can also be fun to use.'
    ],
    points: [
      ['<b>Un .xlsx es un ZIP.</b> Para desbloquear las hojas de un Excel o un Word no hace falta adivinar ninguna contraseña: abre el archivo, borra la etiqueta de protección del XML y lo vuelve a armar. El original no se toca.', '<b>An .xlsx is a ZIP.</b> Unlocking the sheets of an Excel or Word file needs no password guessing: it opens the file, removes the protection tag from the XML and zips it back up. The original is never touched.'],
      ['<b>FFmpeg compilado a WebAssembly.</b> Convierte, comprime y saca GIF con una paleta calculada para cada clip, todo dentro de la pestaña. El video nunca se sube a ningún lado.', '<b>FFmpeg compiled to WebAssembly.</b> It converts, compresses and makes GIFs with a palette computed for each clip, all inside the tab. The video is never uploaded anywhere.'],
      ['<b>La página trae su propio servidor.</b> Bajar videos necesita algo más que un navegador, así que el HTML lleva adentro un pequeño servidor en Python y los lanzadores para Windows y Mac, y los entrega con un clic.', '<b>The page ships its own server.</b> Downloading videos needs more than a browser, so the HTML carries a small Python server plus launchers for Windows and Mac inside it, and hands them over in one click.']
    ],
    stack: ['JavaScript', 'pdf-lib', 'PDF.js', 'JSZip', 'FFmpeg.wasm', 'Python', 'Firebase Hosting'],
    facts: [['16', ['herramientas', 'tools']], ['9', ['temas visuales', 'visual themes']], ['0', ['archivos subidos', 'files uploaded']]]
  },
  conc: {
    skin: 's-conc', short: ['Conciliador', 'Reconciler'],
    kind: ['Finanzas · Privado', 'Finance · Private'],
    name: ['Conciliador de prepagos', 'Prepayment reconciler'],
    tagline: [
      'Asistente offline que convierte la conciliación mensual de prepagos contra devengamientos en dos Excel terminados, con el cuadre garantizado al centavo.',
      'An offline assistant that turns the monthly reconciliation of prepayments against accruals into two finished Excel workbooks, balanced to the cent.'
    ],
    how: [
      'Se abre con doble clic, sin servidor ni instalación. El analista decide qué líneas consume cada pago; un motor determinista hace los splits, las fórmulas y los cuadres en dos monedas, y un validador independiente audita el resultado.',
      'It opens with a double click: no server, no install. The analyst decides which lines each payment consumes; a deterministic engine does the splits, formulas and two-currency balancing, and an independent checker audits the result.'
    ],
    points: [
      ['<b>Cubre los casos reales, no solo el feliz.</b> Un pago que consume devengamientos de varios proveedores, un depósito que absorbe el saldo que dejó un prepago parcial, un mismo grupo de devengamientos repartido entre varias facturas, o un cierre directo contra facturas de devengamiento con tope parcial.', '<b>It covers the real cases, not just the happy path.</b> A payment that consumes accruals from several vendors, a deposit that absorbs what a partial prepayment left open, one pool of accruals split across several invoices, or a direct close against accrual invoices with a partial cap.'],
      ['<b>Port celda a celda de Python a JavaScript.</b> Reimplementa el redondeo bancario de CPython para que los centavos coincidan con la versión original, validada contra entregables reales.', '<b>Cell-identical port from Python to JavaScript.</b> It reimplements CPython\'s banker\'s rounding so every cent matches the original version, which was validated against real deliverables.'],
      ['<b>Multiusuario sin backend.</b> Presencia por heartbeat sobre una carpeta sincronizada: cada pestaña escribe su propio archivo cada 20 s y detecta conflictos antes de guardar.', '<b>Multi-user with no backend.</b> Heartbeat presence over a synced folder: each tab writes its own file every 20 s and detects conflicts before saving.'],
      ['<b>El Excel de salida conserva fórmulas vivas,</b> y solo cuando la fórmula reproduce el valor exacto: el saldo abierto de un devengamiento parcial queda como "original menos lo aplicado". El validador recalcula desde las celdas y nunca confía en un resultado cacheado; si algo no cuadra, marca la línea en vez de entregar el archivo.', '<b>The output workbook keeps live formulas,</b> and only when the formula reproduces the exact value: the open balance of a partial accrual stays as "original minus what was applied". The checker recomputes from cells and never trusts a cached result; if something does not balance, it flags the line instead of delivering the file.']
    ],
    stack: ['JavaScript', 'ExcelJS', 'File System Access API', 'IndexedDB', 'Python (v0)'],
    facts: [['44', ['versiones publicadas', 'releases shipped']], ['17', ['chequeos del validador', 'checker rules']], ['0', ['servidores', 'servers']]]
  },
  batch: {
    skin: 's-batch', flip: true, short: ['Control de lotes', 'Batch control'],
    kind: ['Finanzas · Privado', 'Finance · Private'],
    name: ['Control de lotes de pago', 'Payment batch control'],
    tagline: [
      'Un tablero que valida factura por factura antes de liberar un lote de pagos. Reemplazó a un Excel con macros.',
      'A dashboard that validates every invoice before a payment batch is released. It replaced a macro-driven Excel workbook.'
    ],
    how: [
      'Scripts de PowerShell traen las facturas del ERP por ODBC y las inyectan en un único HTML que se abre como un archivo. La primera versión fue un libro de Excel sin macros, cuyo motor de reglas eran fórmulas LET/LAMBDA generadas por script.',
      'PowerShell scripts pull invoices from the ERP over ODBC and inject them into a single HTML file that opens like a document. The first version was a macro-free Excel workbook whose rule engine was LET/LAMBDA formulas generated by a script.'
    ],
    points: [
      ['<b>50 MB de datos sin colgar el navegador.</b> El JSX se compila en el cliente, así que los datos viajan en un script aparte que parsea el motor nativo: unos 165 ms medidos.', '<b>50 MB of data without freezing the browser.</b> JSX compiles client-side, so the data ships in a separate script parsed by the native engine: about 165 ms measured.'],
      ['<b>Auto-actualización sin servidor</b> para unas veinte PCs: carpeta maestra de solo lectura, archivo de versión y un payload por lista blanca, para que nunca viajen datos ni credenciales.', '<b>Serverless auto-update</b> for about twenty PCs: a read-only master folder, a version file and a whitelisted payload, so data and credentials never travel.'],
      ['<b>La agregación va a la base.</b> Unas 147.000 filas se resuelven con GROUP BY del lado del servidor en lugar de traerlas enteras, con los números medidos documentados en el SQL.', '<b>Aggregation is pushed to the database.</b> About 147,000 rows are resolved with a server-side GROUP BY instead of being fetched whole, with the measurements documented in the SQL.']
    ],
    stack: ['PowerShell', 'SQL · ODBC', 'React', 'SheetJS', 'Excel LET/LAMBDA'],
    facts: [['24', ['reglas de validación', 'validation rules']], ['34', ['bloques de fórmula en la versión Excel', 'formula blocks in the Excel version']], ['~20', ['puestos de trabajo', 'workstations']]]
  },
  sched: {
    skin: 's-sched', half: true, short: ['Asignador de guías', 'Guide scheduler'],
    kind: ['Operaciones · Privado', 'Operations · Private'],
    name: ['Asignador de guías', 'Guide scheduler'],
    tagline: [
      'Asigna guías, disertantes, meetings y cenas en casas de familia a las salidas grupales de una temporada completa, detectando conflictos. Reemplazó a una planilla.',
      'Assigns guides, speakers, meetings and home-hosted dinners to a full season of group departures while detecting conflicts. It replaced a spreadsheet.'
    ],
    points: [
      ['<b>Cenas con cupo:</b> cada casa anfitriona tiene un máximo de pasajeros y días disponibles, y un grupo grande se reparte entre varias.', '<b>Dinners with capacity:</b> every host home has a passenger limit and available days, and a large group is split across several.'],
      ['<b>Cada guía recibe su agenda:</b> un Excel por guía con sus servicios, fechas y bloqueos, listo para mandar por mail. Y un backup completo que se valida antes de restaurarse.', '<b>Every guide gets their schedule:</b> one Excel file per guide with their services, dates and blocked days, ready to email. Plus a full backup that is validated before it is restored.'],
      ['<b>Auto-asignación con restricciones:</b> prioridad del guía, balanceo de carga y chequeo de slots (mañana y tarde conviven, día completo choca con todo).', '<b>Constraint-based auto-assignment:</b> guide priority, load balancing and slot checks (morning and afternoon coexist, full day clashes with everything).'],
      ['<b>Servicios vinculados como componentes conexas:</b> un DFS agrupa los que van juntos y busca un guía libre para todo el bloque.', '<b>Linked services as connected components:</b> a DFS groups the ones that go together and looks for one guide free for the whole block.']
    ],
    stack: ['JavaScript', 'Firestore', 'SheetJS', 'ExcelJS'],
    facts: [['16', ['módulos', 'modules']], ['~9.600', ['líneas', 'lines']]]
  },
  gantt: {
    skin: 's-gantt', half: true, short: ['Tablero de salidas', 'Departures board'],
    kind: ['Operaciones · Privado', 'Operations · Private'],
    name: ['Tablero de salidas', 'Departures board'],
    tagline: [
      'Dónde está cada grupo de viaje hoy, cuántos pasajeros lleva y quién suma días antes o después del viaje, a partir de un Excel exportado.',
      'Where every travel group is today, how many passengers it carries and who adds days before or after the trip, from one exported Excel file.'
    ],
    points: [
      ['<b>Pasajeros y días extra por viaje:</b> cada grupo muestra su cantidad de pasajeros y si tiene extensión previa o posterior, con totales por semana, mes, semestre o región.', '<b>Passengers and extra days per trip:</b> each group shows its passenger count and whether it has a pre- or post-trip extension, with totals by week, month, semester or region.'],
      ['<b>Exporta lo que estás viendo:</b> el filtro actual sale a Excel o se copia al portapapeles ya ordenado para pegarlo en el sistema siguiente.', '<b>Export what you are looking at:</b> the current filter goes out to Excel or is copied to the clipboard, already laid out to paste into the next system.'],
      ['<b>Ubicación por itinerario:</b> cruza la fecha con el recorrido de cada programa y muestra ciudad y día de viaje.', '<b>Location from itinerary:</b> it crosses the date with each programme\'s route and shows the city and trip day.'],
      ['<b>Un panel de administración que genera código:</b> edita regiones e itinerarios y los serializa a archivos .js. Un CMS sin backend. El Gantt es SVG hecho a mano.', '<b>An admin panel that writes code:</b> it edits regions and itineraries and serialises them back to .js files. A CMS with no backend. The Gantt is hand-written SVG.']
    ],
    stack: ['React 18 sin build', 'Recharts', 'SheetJS', 'Realtime DB por REST'],
    facts: [['16', ['itinerarios', 'itineraries']], ['1', ['archivo HTML', 'HTML file']]]
  },
  invisi: {
    skin: 's-invisi', short: ['Invisipal', 'Invisipal'],
    kind: ['Escritorio · Windows', 'Desktop · Windows'],
    link: 'https://github.com/nicoopal/invisipal',
    name: ['Invisipal', 'Invisipal'],
    tagline: [
      'Un teleprompter privado: una ventana con tus notas que no aparece cuando compartís pantalla ni en las grabaciones. Para presentaciones, demos y llamadas.',
      'A private teleprompter: a window with your notes that does not show up when you share your screen or in recordings. For presentations, demos and calls.'
    ],
    how: [
      'Python con la librería estándar y nada más. Le pide a Windows que excluya la ventana de la captura y después verifica, una vez por segundo, que siga siendo cierto.',
      'Python with the standard library and nothing else. It asks Windows to exclude the window from capture and then verifies, once a second, that this is still true.'
    ],
    points: [
      ['<b>Sin flash inicial.</b> La ventana nace con opacidad cero y solo se muestra después de aplicar y comprobar la exclusión. Si no, una pantalla ya compartida captaría unos cuadros.', '<b>No first-frame leak.</b> The window is born fully transparent and only appears after exclusion is applied and confirmed. Otherwise an already-shared screen would capture a few frames.'],
      ['<b>Honestidad como función.</b> Un indicador muestra el estado real leído de Windows: privado, en negro o visible. No lo que la app cree.', '<b>Honesty as a feature.</b> A badge shows the real state read back from Windows: private, blacked out or visible. Not what the app assumes.'],
      ['<b>Atajos que no rompen el teclado latino.</b> Windows reporta AltGr como Ctrl+Alt, así que un atajo global podría impedir tipear la arroba. La app consulta el layout activo y lo mueve.', '<b>Hotkeys that respect Latin American keyboards.</b> Windows reports AltGr as Ctrl+Alt, so a global hotkey could block typing the at sign. The app inspects the active layout and moves it.']
    ],
    stack: ['Python stdlib', 'tkinter', 'Win32 · DWM', 'Inno Setup', 'MSIX', 'GitHub Actions'],
    facts: [['166', ['tests', 'tests']], ['0', ['dependencias', 'dependencies']], ['19', ['atajos globales', 'global hotkeys']]]
  },
  hand: {
    skin: 's-hand', flip: true, short: ['Handpal', 'Handpal'],
    kind: ['Escritorio · Windows', 'Desktop · Windows'],
    link: 'https://github.com/nicoopal/handpal',
    name: ['Handpal', 'Handpal'],
    tagline: [
      'Escribe a mano con tu mouse. Tipeás un texto, marcás un recuadro en pantalla y Handpal mueve el cursor real dibujando cada letra.',
      'It handwrites with your mouse. Type some text, drag a box on screen, and Handpal moves the real cursor drawing every letter.'
    ],
    how: [
      'Sirve para anotar pizarras web, PDFs o cualquier app de dibujo sin tableta. La demo de al lado usa el mismo tipo de fuente de trazo único: escribí lo que quieras.',
      'Useful for annotating web whiteboards, PDFs or any drawing app without a tablet. The demo next to this uses the same kind of single-stroke font: type anything.'
    ],
    points: [
      ['<b>Ritmo pensado para navegadores.</b> Un navegador muestrea el mouse una vez por cuadro y une los puntos con rectas, lo que come las esquinas. Handpal limita el giro a 45° por cuadro y se detiene en cada vértice.', '<b>Paced for browsers.</b> A browser samples the mouse once per frame and joins the points with straight lines, which eats corners. Handpal caps turning at 45° per frame and dwells on each vertex.'],
      ['<b>Fuentes de trazo único.</b> Una fuente normal guarda el contorno y trazarla da letras huecas. Parser propio de paths SVG y ajuste a la caja por búsqueda binaria.', '<b>Single-stroke fonts.</b> A normal font stores outlines, and tracing those gives hollow letters. Its own SVG path parser, and binary-search fitting to the box.'],
      ['<b>Si agarrás el mouse, suelta.</b> Antes de cada paso revisa si el cursor se movió solo; el botón nunca queda presionado.', '<b>Grab the mouse and it lets go.</b> Before every step it checks whether the cursor moved on its own; the button is never left pressed.']
    ],
    stack: ['Python', 'PySide6', 'Win32 SendInput', 'PyInstaller', 'pytest'],
    facts: [['9', ['fuentes incluidas', 'bundled fonts']], ['1', ['dependencia', 'dependency']]]
  },
  vault: {
    skin: 's-vault', short: ['Pals Vault', 'Pals Vault'],
    kind: ['IA aplicada · Privado', 'Applied AI · Private'],
    name: ['Pals Vault', 'Pals Vault'],
    tagline: [
      'Un segundo cerebro: capturás una idea en segundos, la IA la etiqueta sola, y después buscás por significado o le preguntás a tus propias notas.',
      'A second brain: capture an idea in seconds, AI tags it for you, then search by meaning or ask questions of your own notes.'
    ],
    how: [
      'Cada nota pasa por dos funciones en paralelo: una la clasifica y otra calcula su embedding. La búsqueda semántica, las notas relacionadas y el grafo se resuelven en el navegador.',
      'Each note goes through two functions in parallel: one classifies it, the other computes its embedding. Semantic search, related notes and the graph are all resolved in the browser.'
    ],
    points: [
      ['<b>Tararear y obtener MIDI, sin servidor.</b> Graba, resamplea a 22.050 Hz y corre un modelo de transcripción en el navegador; el resultado va a un piano roll.', '<b>Hum it, get MIDI, no server.</b> It records, resamples to 22,050 Hz and runs a transcription model in the browser; the result lands in a piano roll.'],
      ['<b>Grafo de conocimiento sin librerías.</b> Simulación de fuerzas propia sobre canvas; las conexiones salen de etiquetas compartidas y de similitud coseno entre embeddings.', '<b>A knowledge graph with no libraries.</b> A hand-written force simulation on canvas; links come from shared tags and cosine similarity between embeddings.'],
      ['<b>RAG sin base vectorial.</b> El navegador rankea las notas relevantes y la función solo arma la respuesta con citas. Las etiquetas aprenden del vocabulario ya usado.', '<b>RAG with no vector database.</b> The browser ranks the relevant notes and the function only assembles the cited answer. Tags learn from the vocabulary already in use.']
    ],
    stack: ['React 19', 'Firestore', 'Cloud Functions', 'Gemini 2.5 Flash', 'Embeddings', 'TensorFlow.js'],
    facts: [['4', ['Cloud Functions', 'Cloud Functions']], ['6', ['tipos de nota', 'note types']], ['$0', ['por mes', 'per month']]]
  },
  down: {
    skin: 's-down', flip: true, short: ['Pals Downloader', 'Pals Downloader'],
    kind: ['Web · Auto-hospedado', 'Web · Self-hosted'],
    link: 'https://github.com/nicoopal/pals-downloader',
    name: ['Pals Downloader', 'Pals Downloader'],
    tagline: [
      'Un descargador de audio y video privado, auto-hospedado y con lista blanca de usuarios, que corre entero en capas gratuitas.',
      'A private, self-hosted audio and video downloader with a user allowlist, running entirely on free tiers.'
    ],
    how: [
      'La web habla con una API de trabajos en una VM gratuita. El repo incluye una guía paso a paso para que alguien que no programa arme el suyo.',
      'The web app talks to a jobs API on a free VM. The repo ships a step-by-step guide so a non-programmer can stand up their own.'
    ],
    points: [
      ['<b>Entrega por ticket.</b> El archivo se baja con la barra nativa del navegador en lugar de cargarse en memoria, que era lo que tumbaba la pestaña en el celular.', '<b>Ticketed delivery.</b> The file downloads through the browser\'s native bar instead of being loaded into memory, which is what used to crash the tab on mobile.'],
      ['<b>Un motor, dos backends.</b> El mismo código corre en la VM y en tu propia PC, que publica su túnel en Firestore y lo reconstruye sola si se cae.', '<b>One engine, two backends.</b> The same code runs on the VM and on your own PC, which publishes its tunnel to Firestore and rebuilds it by itself if it drops.'],
      ['<b>Tres capas contra cuelgues</b> y GIF en dos pasadas, con una paleta calculada a medida de cada clip.', '<b>Three layers against hangs,</b> and two-pass GIFs with a palette computed for each clip.']
    ],
    stack: ['React', 'FastAPI', 'ffmpeg', 'Docker', 'Caddy', 'Oracle Cloud', 'Firebase'],
    facts: [['$0', ['por mes', 'per month']], ['9', ['endpoints', 'endpoints']], ['454', ['líneas de guía', 'lines of setup guide']]]
  },
  portal: {
    skin: 's-portal', short: ['Portal legislativo', 'Legislative portal'],
    kind: ['IA aplicada · Privado', 'Applied AI · Private'],
    name: ['Portal de un equipo legislativo', 'A legislative team portal'],
    tagline: [
      'Portal privado para un equipo de asesores legislativos: informes y análisis de proyectos de ley, seguimiento de comisiones y cuestiones políticas, más una agenda semanal que la IA extrae de un PDF.',
      'A private portal for a team of legislative advisers: reports and analysis of bills, committee tracking and political briefings, plus a weekly agenda that AI extracts from a PDF.'
    ],
    how: [
      'Alguien arrastra el PDF oficial; una función en la nube lo manda al modelo con un esquema estricto y guarda la agenda estructurada. La clave de la API nunca llega al navegador.',
      'Someone drops in the official PDF; a cloud function sends it to the model with a strict schema and stores the structured agenda. The API key never reaches the browser.'
    ],
    points: [
      ['<b>Análisis, no solo agenda.</b> Informes sobre proyectos de ley, carpetas de debate, informes de comisión con lo que dijo cada expositor, dossiers y un vademécum de datos y citas. Todo cerrado al equipo, con cuatro niveles de permiso.', '<b>Analysis, not just an agenda.</b> Reports on bills, debate briefs, committee reports with what each speaker said, dossiers and a handbook of facts and quotes. All closed to the team, with four permission levels.'],
      ['<b>El HTML público no contiene nada.</b> Cada informe son dos archivos: un cascarón que solo sabe autenticar y el contenido, guardado aparte y protegido por reglas que cruzan dos servicios.', '<b>The public HTML contains nothing.</b> Each report is two files: a shell that only knows how to authenticate, and the content, stored separately and guarded by rules that span two services.'],
      ['<b>Accesos externos que vencen a los 15 días,</b> sin links reutilizables: la función entrega el contenido directo a la sesión validada.', '<b>External access that expires after 15 days,</b> with no reusable links: the function hands the content straight to the validated session.'],
      ['<b>Marca de agua por lector:</b> email y hora en mosaico diagonal. Documentada como disuasión y trazabilidad, no como DRM.', '<b>A per-reader watermark:</b> email and time tiled diagonally. Documented as deterrence and traceability, not DRM.']
    ],
    stack: ['JavaScript', 'Firebase Auth', 'Firestore', 'Storage', 'Cloud Functions', 'Gemini 2.5 Flash'],
    facts: [['4', ['niveles de permiso', 'permission levels']], ['13', ['informes publicados', 'reports published']], ['2', ['Cloud Functions', 'Cloud Functions']]]
  },
  zap: {
    skin: 's-zap', short: ['Zappinglate', 'Zappinglate'],
    kind: ['Web · Privado', 'Web · Private'],
    name: ['Zappinglate', 'Zappinglate'],
    tagline: [
      'Una tele vieja para hacer zapping por videos de YouTube que nadie vio. Cada video que mirás recibe, probablemente, su primera vista.',
      'An old TV for channel-surfing through YouTube videos nobody has watched. Every video you see is probably getting its first view.'
    ],
    how: [
      'Un recolector corre una vez por día en GitHub Actions, llena los "canales" y despliega solo. Los visitantes nunca gastan cuota de API. Tocá la pantalla.',
      'A collector runs once a day on GitHub Actions, fills the "channels" and deploys itself. Visitors never spend API quota. Tap the screen.'
    ],
    points: [
      ['<b>Cómo se encuentra un video sin vistas:</b> buscando los nombres de archivo que ponen las cámaras por defecto (IMG_, DSCN, MVI_, GOPR) con sufijos al azar y fecha reciente.', '<b>How to find a video with no views:</b> search for the default filenames cameras produce (IMG_, DSCN, MVI_, GOPR) with random suffixes and a recent date.'],
      ['<b>Zapping instantáneo con dos reproductores.</b> El de atrás precarga el próximo canal en silencio y el corte se tapa con 260 ms de estática.', '<b>Instant zapping with two players.</b> The one behind preloads the next channel muted, and the cut is covered by 260 ms of static.'],
      ['<b>Entrás al programa ya empezado,</b> como en la tele: cada video arranca en un punto al azar.', '<b>You land mid-programme,</b> like real TV: each video starts at a random point.']
    ],
    stack: ['React', 'Vite', 'YouTube Data API', 'GitHub Actions', 'Firestore'],
    facts: [['2.376', ['videos sin vistas en el pool', 'unwatched videos in the pool']], ['1', ['cron diario', 'daily cron']]]
  },
  color: {
    skin: 's-color', flip: true, short: ['Libro para colorear', 'Colouring book'],
    kind: ['Familia · Privado', 'Family · Private'],
    name: ['Libro para colorear', 'Colouring book'],
    tagline: [
      'Un libro para colorear hecho en casa: tocás una zona y se pinta con colores, degradés, brillantina o texturas. Probalo acá al lado.',
      'A home-made colouring book: tap an area and it fills with colours, gradients, glitter or textures. Try it right here.'
    ],
    how: [
      'La demo usa las mismas ideas que la app: el relleno mira el dibujo original, y deshacer vuelve a ejecutar la lista de toques.',
      'The demo uses the same ideas as the app: the fill looks at the original drawing, and undo replays the list of taps.'
    ],
    points: [
      ['<b>Flood fill contra el original, no contra lo pintado.</b> Así un color oscuro no se convierte en pared y una zona con degradé se puede volver a pintar entera.', '<b>Flood fill against the original, not the paint.</b> A dark colour never becomes a wall, and an area holding a gradient can be repainted whole.'],
      ['<b>El dibujo es una lista de toques.</b> No se guarda un bitmap: se guardan los clics y se vuelven a ejecutar. Deshacer y guardar salen casi gratis.', '<b>The drawing is a list of taps.</b> No bitmap is stored: the clicks are saved and replayed. Undo and saving come almost free.'],
      ['<b>Rellenos procedurales por píxel:</b> brillantina con un hash determinista (el dibujo guardado se repinta idéntico) y corazones con una curva implícita.', '<b>Procedural per-pixel fills:</b> glitter from a deterministic hash (a saved drawing repaints identically) and hearts from an implicit curve.']
    ],
    stack: ['JavaScript', 'Canvas 2D', 'Web Audio', 'Firebase'],
    facts: [['131', ['dibujos', 'drawings']], ['36', ['texturas', 'textures']], ['15', ['degradés', 'gradients']]]
  },
  fashion: {
    skin: 's-fashion', half: true, short: ['Estudio de moda', 'Fashion studio'],
    kind: ['Familia · Privado', 'Family · Private'],
    name: ['Estudio de moda', 'Fashion studio'],
    tagline: [
      'Un juego de vestir donde no hay una sola imagen: cada prenda es una función que devuelve SVG.',
      'A dress-up game without a single image: every garment is a function that returns SVG.'
    ],
    points: [
      ['<b>Una mini librería de dibujo vectorial:</b> puntos a curvas con Catmull-Rom, simetría desde media figura y cintas de ancho variable para mechones y mangas.', '<b>A tiny vector drawing library:</b> points to curves via Catmull-Rom, symmetry from half a figure, and variable-width ribbons for locks of hair and sleeves.'],
      ['<b>La ropa se calcula contra el cuerpo.</b> El contorno son tablas interpoladas, así cualquier combinación calza. Las sombras se derivan del color elegido.', '<b>Clothes are computed against the body.</b> The outline is interpolated tables, so any combination fits. Shading is derived from the chosen colour.']
    ],
    stack: ['JavaScript', 'SVG procedural', 'Firebase'],
    facts: [['20', ['categorías', 'categories']], ['0', ['imágenes', 'images']]]
  },
  music: {
    skin: 's-music', half: true, short: ['Pals Music', 'Pals Music'],
    kind: ['Datos · Privado', 'Data · Private'],
    live: 'https://pals-music.web.app',
    name: ['Pals Music', 'Pals Music'],
    tagline: [
      'Una estantería navegable para una colección de unos 3.000 álbumes: portadas, metadata, links a streaming y estadísticas.',
      'A browsable shelf for a collection of about 3,000 albums: covers, metadata, streaming links and stats.'
    ],
    points: [
      ['<b>Mosaico ordenado por color.</b> Ordena por matiz, pero aparta las portadas casi grises y las ordena por luminosidad: el matiz de un gris es arbitrario y ensucia el arcoíris.', '<b>A mosaic sorted by colour.</b> It sorts by hue but sets aside near-grey covers and orders them by lightness: the hue of a grey is arbitrary and muddies the rainbow.'],
      ['<b>Emparejar portadas en dos fases:</b> prefijo exacto primero, coincidencia difusa después, con guardas contra falsos positivos. Si un link no es confiable, guarda vacío.', '<b>Two-phase cover matching:</b> exact prefix first, fuzzy matching second, with guards against false positives. If a link is not trustworthy, it stores nothing.']
    ],
    stack: ['Python', 'Pillow', 'mutagen', 'JavaScript', 'APIs de música'],
    facts: [['3.002', ['álbumes', 'albums']], ['37.156', ['pistas', 'tracks']]]
  },
  murmur: {
    skin: 's-murmur', short: ['murmur', 'murmur'],
    kind: ['Experimento · Audio', 'Experiment · Audio'],
    name: ['murmur', 'murmur'],
    tagline: [
      'Música ambient que se genera sola y nunca se repite, en un único archivo HTML sin dependencias.',
      'Ambient music that generates itself and never repeats, in a single HTML file with no dependencies.'
    ],
    how: [
      'Un experimento distinto: lienzo en blanco y libertad creativa total para un agente de IA. Lo que suena al lado es una versión reducida, sintetizada en tu navegador en este momento.',
      'A different kind of experiment: a blank canvas and total creative freedom for an AI agent. What plays next to this is a reduced version, synthesised in your browser right now.'
    ],
    points: [
      ['<b>Aleatorio que siempre suena bien.</b> Las notas se sortean solo dentro de una escala pentatónica, así el azar puro nunca desafina.', '<b>Randomness that always sounds right.</b> Notes are drawn only from a pentatonic scale, so pure chance never hits a wrong one.'],
      ['<b>Reverb sin samples.</b> El impulso se genera en código: cinco segundos de ruido con una envolvente que decae.', '<b>Reverb with no samples.</b> The impulse is generated in code: five seconds of noise under a decaying envelope.'],
      ['<b>Drones binaurales:</b> dos osciladores por nota, uno en cada oído, separados por 6 Hz.', '<b>Binaural drones:</b> two oscillators per note, one in each ear, 6 Hz apart.']
    ],
    stack: ['Web Audio API', 'Canvas 2D'],
    facts: [['575', ['líneas', 'lines']], ['1', ['archivo', 'file']], ['0', ['samples', 'samples']]]
  },
  iee: {
    skin: 's-iee', half: true, short: ['Portal retro', 'Retro portal'],
    kind: ['Web · Privado', 'Web · Private'],
    name: ['Portal retro para amigos', 'A retro portal for friends'],
    tagline: [
      'Una red social privada para un grupo cerrado, con estética deliberada de 1999 y sin un solo servidor propio.',
      'A private social network for a closed group, with a deliberate 1999 look and not a single server of its own.'
    ],
    points: [
      ['<b>Las reglas de la base son el backend:</b> roles por invitación, y un cooldown de 7 días para cambiar el apodo impuesto del lado del servidor.', '<b>The database rules are the backend:</b> invitation-based roles, and a 7-day cooldown on nickname changes enforced server-side.'],
      ['<b>Analizador de chats que corre en el navegador.</b> Detecta cuatro formatos de exportación y cuenta emojis por grafema; solo se guarda el resumen, nunca los mensajes.', '<b>A chat analyser that runs in the browser.</b> It detects four export formats and counts emoji by grapheme; only the summary is stored, never the messages.']
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Firebase'],
    facts: [['11', ['páginas', 'pages']], ['0', ['funciones de servidor', 'server functions']]]
  },
  also: {
    skin: 's-also', half: true, short: ['Y también', 'And also'], noTile: true,
    kind: ['Tres más, en breve', 'Three more, briefly'],
    name: ['Y también', 'And also'],
    also: [
      [['Comparador de precios del hogar', 'Household price tracker'], ['PWA que funciona sin conexión. <b>El código no se descarga hasta después del login,</b> el mapa pinta cada local de verde a rojo según el precio, y el gráfico histórico es SVG hecho a mano.', 'An offline-first PWA. <b>The code is not even downloaded until after login,</b> the map colours each shop green to red by price, and the history chart is hand-written SVG.']],
      [['Calendario de prepagos', 'Prepayment calendar'], ['Calcula cuándo procesar y cuándo pagar a cada proveedor según las salidas. <b>Motor de fechas sin zonas horarias</b> y un exportador a calendario escrito a mano, con identificadores estables para que reimportar actualice en vez de duplicar.', 'Works out when to process and when to pay each supplier from the departure dates. <b>A timezone-free date engine</b> and a hand-written calendar exporter with stable identifiers, so re-importing updates instead of duplicating.']],
      [['Libro de memorias familiar', 'A family memoir'], ['Audios transcriptos que viven como Markdown versionado. <b>Git como gestor de contenido:</b> un script idempotente los espeja a la base usando el hash de cada archivo, y la web solo puede tocar el campo de estado.', 'Transcribed voice notes living as versioned Markdown. <b>Git as the CMS:</b> an idempotent script mirrors them to the database using each file\'s hash, and the web app may only touch the status field.']]
    ]
  }
};
