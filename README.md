# portfolio-nicopal

Landing de portfolio: 15 proyectos (12 privados) contados por dentro, con miniaturas interactivas dibujadas por código.

- Sitio: https://portfolio-nicopal.web.app
- Sin framework ni build: `public/` es HTML, CSS y JavaScript estáticos.
- Bilingüe (ES / EN) con un botón en la barra superior.

## Estructura

| Archivo | Qué tiene |
|---|---|
| `public/index.html` | Hero, "Cómo trabajo", contacto |
| `public/js/projects.js` | Textos de cada proyecto, en español e inglés |
| `public/js/demos.js` | Las miniaturas interactivas |
| `public/js/main.js` | Render, idioma, animaciones de entrada |
| `public/css/styles.css` | Estilos y la "piel" de cada proyecto |

## Ver en local

```bash
npx serve public
```

## Publicar

El proyecto de Firebase está fijado en `.firebaserc` y el sitio en `firebase.json`. Pasar siempre el proyecto explícito:

```bash
firebase deploy --only hosting --project portfolio-nicopal
```

Los trazos de escritura a mano derivan de EMS Tech (SIL Open Font License, ver `public/js/OFL-strokefont.txt`).
