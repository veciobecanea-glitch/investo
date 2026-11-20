# Impara a Investire

App per imparare a investire con un portafoglio finto e **prezzi veri**, pubblicata gratis con GitHub Pages.

👉 Le istruzioni passo passo sono in **[GUIDA.md](GUIDA.md)** (oppure apri `guida.html` dal sito).

Cosa contiene:

- `index.html`: l'app (un solo file).
- `robot/` e `.github/workflows/`: il robot che ogni ora aggiorna i prezzi (Yahoo Finance) e pubblica il sito.
- `cloudflare/worker.js`: il ponte per i prezzi in tempo reale (Tradegate, Yahoo) e le notizie (Google News).
- `catalog.json`: l'elenco degli strumenti che il robot deve cercare.
- `data/`: la memoria del robot (codici trovati ed eventi). La gestisce lui.
