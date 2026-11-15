# portfolio-nicopal

Portfolio de Nicolás Palermo: 15 proyectos (12 privados) contados por dentro, con miniaturas interactivas dibujadas por código.

- **Sitio:** https://portfolio-nicopal.web.app
- **Repo:** https://github.com/nicoopal/portfolio-nicopal
- Sin framework ni build: `public/` es HTML, CSS y JavaScript estáticos.
- Bilingüe (ES / EN). Arranca en el idioma del navegador y se cambia con el botón de la barra superior.

## Qué muestra

Tres capítulos, más una tarjeta breve con tres proyectos extra.

| Capítulo | Proyectos |
|---|---|
| En el trabajo | Conciliador de prepagos, Control de lotes de pago, Asignador de guías, Tablero de salidas |
| Productos | Invisipal, Handpal, Pals Vault, Pals Downloader, Portal de un equipo legislativo |
| De madrugada | Zappinglate, Libro para colorear, Estudio de moda, Pals Music, murmur, Portal retro para amigos |
| Y también | Comparador de precios del hogar, Calendario de prepagos, Libro de memorias familiar |

Solo Invisipal, Handpal y Pals Downloader son públicos y llevan link al código.

## Criterios de contenido

- Los proyectos privados se describen sin nombre de empresa, sistemas, cuentas, proveedores ni personas.
- Todas las demos usan datos inventados y se dibujan en la página; no se conectan a ningún proyecto real.
- Los números (versiones, tests, líneas, reglas) salen del código de cada repo. Si un repo cambia, hay que actualizarlos a mano en `public/js/projects.js`.

## Estructura

| Archivo | Qué tiene |
|---|---|
| `public/index.html` | Hero, "Cómo trabajo", habilidades, contacto y la config de Analytics |
| `public/js/projects.js` | Capítulos y textos de cada proyecto, como pares `[español, inglés]` |
| `public/js/demos.js` | Las miniaturas interactivas, una función por proyecto |
| `public/js/main.js` | Render de los paneles, cambio de idioma, animaciones de entrada |
| `public/js/strokefont.js` | Glifos de trazo único para la escritura a mano |
| `public/css/styles.css` | Estilos base y la "piel" de cada proyecto (clases `s-*`) |

## Cómo editar

- **Cambiar un texto de un proyecto:** editar su entrada en `public/js/projects.js`. Cada texto tiene las dos versiones.
- **Cambiar un texto fijo** (hero, "Cómo trabajo", contacto): editar `public/index.html`. El español va como contenido y el inglés en el atributo `data-en`.
- **Agregar un proyecto:** sumar su entrada en `PROJECTS`, ubicar su id en `rows` del capítulo, y definir su piel `s-<id>` en el CSS. La demo es opcional: una función `DEMOS.<id>` en `demos.js`.
- **Contacto:** los tres botones (email, LinkedIn, GitHub) están en la sección `#contacto` de `index.html`.

## Ver en local

```bash
npx serve public
```

## Publicar

El Firebase CLI de esta máquina tiene otro proyecto (`regis-book`) como activo para toda la carpeta `C:\apps`, y el `.firebaserc` de este repo no alcanza para cambiarlo. Pasar siempre el proyecto explícito:

```bash
firebase deploy --only hosting --project portfolio-nicopal
```

Antes de pushear, confirmar que el remoto sea este repo:

```bash
git remote -v
```

Los archivos JS y CSS se cachean una hora, así que un cambio puede tardar en verse; Ctrl+F5 lo fuerza.

## Créditos

Los trazos de escritura a mano derivan de EMS Tech (Sheldon B. Michaels / Windell H. Oskay, a partir de Architects Daughter de Kimberly Geswein), bajo SIL Open Font License. El texto de la licencia está en `public/js/OFL-strokefont.txt`.
