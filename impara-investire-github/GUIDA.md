# Guida: mettere online «Impara a Investire» gratis

Alla fine avrai la tua app su un indirizzo tipo **https://tuonome.github.io/impara-investire/**, con:

- prezzi veri;
- sincronizzazione tra PC e telefono;
- notifiche;
- analizzatore di notizie.

**Tutto gratis, senza carta di credito.**

Tempo: circa **30-40 minuti** la prima volta. Ti consiglio di farlo dal **computer**.

> 💡 Se qualcosa non va come descritto, niente panico: le schermate di questi siti cambiano un po' nel tempo. Cerca il pulsante con un nome simile.

---

## Prima di iniziare: salva i tuoi dati

Se hai già usato l'app dentro Claude, prima di tutto salva i tuoi dati:

1. Apri l'app su Claude.
2. Vai in **⚙️ Impostazioni → 💾 Backup dei dati → 📤 Esporta**.
3. Salva il file (oppure copia il testo in una nota).

Lo reimporterai alla fine (passo 9).

---

## Passo 1 — Crea l'account GitHub (2 minuti)

1. Vai su **github.com** e premi **Sign up**.
2. Inserisci email, password e un nome utente.
   - Il nome utente finirà nell'indirizzo del sito, per esempio `mario-rossi` diventa `mario-rossi.github.io`.
3. Conferma l'email.

---

## Passo 2 — Crea il progetto e carica i file (5 minuti)

1. Estrai lo zip che ti ho dato in una cartella del computer.
2. Su GitHub, in alto a destra premi **+ → New repository**.
3. Nome: **impara-investire**.
   - Seleziona **Public**: serve per avere il sito gratis.
   - I tuoi dati personali **non** finiscono qui.
4. Premi **Create repository**.
5. Nella pagina che si apre premi il link **uploading an existing file**.
6. Trascina **tutti** i file e le cartelle dello zip:
   - `index.html`, `guida.html`, `config.json`, `catalog.json`, `manifest.webmanifest`, `sw.js`, le icone;
   - le cartelle `robot`, `data`, `cloudflare`.
7. In basso premi **Commit changes**.

### ⚠️ La cartella nascosta `.github`

La cartella `.github` contiene il "robot". Su Mac e Windows è spesso **nascosta** e il trascinamento potrebbe saltarla.

Per controllare se c'è, guarda se nel progetto su GitHub compare `.github`. Se non c'è, creala a mano:

1. Premi **Add file → Create new file**.
2. Come nome scrivi esattamente: `.github/workflows/aggiorna.yml`
   - Quando scrivi la `/`, GitHub crea le cartelle da solo.
3. Apri il file `aggiorna.yml` dello zip (si trova in `.github/workflows/`) con il Blocco note.
   - Su Mac premi Cmd+Shift+. per vedere i file nascosti.
4. Copia tutto il testo e incollalo su GitHub.
5. Premi **Commit changes**.

---

## Passo 3 — Accendi il sito e il robot (3 minuti)

Nel tuo progetto su GitHub:

1. **Settings → Pages**: alla voce **Source** scegli **GitHub Actions**.
2. **Settings → Actions → General**:
   - controlla che le Actions siano permesse ("Allow all actions");
   - in fondo, alla voce **Workflow permissions**, scegli **Read and write permissions** e premi **Save**.
3. Vai nella scheda **Actions** del progetto.
   - Se compare un pulsante verde tipo "I understand my workflows, go ahead and enable them", premilo.
4. A sinistra scegli **Aggiorna prezzi e sito**, poi a destra **Run workflow → Run workflow**.

La prima volta il robot impiega **15-30 minuti**, perché deve cercare i codici di migliaia di titoli. Quando compare il pallino verde ✅, la tua app è online su:

**https://TUONOMEUTENTE.github.io/impara-investire/**

Da quel momento il robot gira da solo **ogni ora**:
- completa poco alla volta i codici che mancano;
- aggiorna i prezzi;
- ogni 6 ore aggiorna l'intero catalogo.

---

## Passo 4 — Il ponte Cloudflare per i prezzi in tempo reale e le notizie (7 minuti)

1. Vai su **dash.cloudflare.com/sign-up** e crea un account gratuito.
2. Nel menu a sinistra apri **Workers & Pages** (a volte si trova sotto "Compute"), poi premi **Create → Create Worker**.
3. Dai un nome, per esempio **impara-ponte**, e premi **Deploy**.
4. Premi **Edit code**. Cancella tutto il codice di esempio e incolla tutto il contenuto del file `cloudflare/worker.js` dello zip. Premi **Deploy**.
5. Copia l'indirizzo del worker, del tipo `https://impara-ponte.TUONOME.workers.dev`.
6. Per provarlo, apri nel browser: `https://impara-ponte.TUONOME.workers.dev/tg?isin=IE00BK5BQT80`
   - Se vedi dei numeri (il prezzo di VWCE), funziona ✅.
7. Torna su GitHub, apri il file **config.json** e premi la matita ✏️ per modificarlo.
   - Nella riga `"worker": ""` incolla l'indirizzo tra le virgolette, così:
     `"worker": "https://impara-ponte.TUONOME.workers.dev"`
   - Premi **Commit changes**. Il sito si aggiorna da solo in pochi minuti.

**Facoltativo, per sicurezza:** puoi fare in modo che il ponte funzioni solo con la tua app.
1. In Cloudflare apri il worker → **Settings → Variables and Secrets → Add**.
2. Nome: `ALLOWED_ORIGIN`. Valore: `https://TUONOMEUTENTE.github.io`
3. Salva con **Deploy**.

---

## Passo 5 — Installa l'app sul telefono (1 minuto)

- **Android (Chrome):** apri il tuo indirizzo → menu ⋮ → **Installa app** (oppure "Aggiungi a schermata Home").
- **iPhone (Safari):** apri il tuo indirizzo → pulsante **Condividi** □↑ → **Aggiungi alla schermata Home**.

Avrai l'icona come una vera app. Lezioni, vocabolario e simulazione funzionano anche senza internet.

---

## Passo 6 — Sincronizza PC e telefono (5 minuti)

Serve una "chiave" GitHub che possa solo salvare i tuoi dati in un file privato (Gist).

1. Su GitHub, clicca la tua foto in alto a destra → **Settings**.
2. In fondo a sinistra apri **Developer settings → Personal access tokens → Tokens (classic)**.
3. Premi **Generate new token → Generate new token (classic)**. Compila così:
   - **Note:** `impara-investire`
   - **Expiration:** scegli **No expiration** oppure 1 anno, e ricordati di rinnovarla.
   - Spunta **solo** la casella **gist**, nient'altro.
4. Premi **Generate token** e **copia subito** la chiave, che inizia con `ghp_`. GitHub non te la mostrerà più.
5. **Sul primo dispositivo** (per esempio il PC):
   - apri l'app → ⚙️ Impostazioni → ☁️ Sincronizza PC e telefono;
   - incolla la chiave e premi **Primo dispositivo: crea**;
   - comparirà un **codice di sincronizzazione**: copialo.
6. **Sul secondo dispositivo** (per esempio il telefono):
   - nelle stesse impostazioni incolla **la stessa chiave** e il **codice**;
   - premi **Altro dispositivo: collega**.

Da ora ogni modifica viene salvata su GitHub in pochi secondi e ritrovata sull'altro dispositivo quando lo apri.

> 🔒 La chiave resta salvata solo nei tuoi dispositivi: non la scrivere mai nei file del progetto. Se la perdi o pensi che qualcuno l'abbia vista, cancellala su GitHub (stessa pagina dei token) e creane una nuova.

---

## Passo 7 — Notifiche sul telefono anche ad app chiusa (5 minuti)

1. Installa l'app gratuita **ntfy** sul telefono (Play Store o App Store).
2. Nella tua app: ⚙️ Impostazioni → 📲 Notifiche sul telefono → **Crea il mio canale**.
   - Compare un nome tipo `impara-k3j9x2m1q8zz`.
3. In ntfy premi **+** e iscriviti a quel nome, lasciando il server predefinito `ntfy.sh`.
4. Nella tua app premi **Invia notifica di prova**: deve arrivarti sul telefono ✅.

Così ricevi gli avvisi quando l'app è aperta. **Per riceverli anche ad app chiusa**, devi dare al robot l'accesso agli avvisi:

1. Nel progetto su GitHub apri **Settings → Secrets and variables → Actions → New repository secret**.
2. Crea il segreto `GIST_ID`: come valore metti il **codice di sincronizzazione** del passo 6.
3. Crea il segreto `GIST_TOKEN`: come valore metti la **chiave** `ghp_…` del passo 6.

Il robot ogni ora controlla i tuoi avvisi di prezzo e, se uno scatta, ti manda la notifica.

> Tieni segreto il nome del canale ntfy: chi lo conosce può leggere le tue notifiche.

---

## Passo 8 — Riassunto delle notizie con l'IA (facoltativo, 2 minuti)

L'analizzatore di notizie funziona già senza IA. Per avere anche il pulsante **✨ Spiegamelo semplice**:

1. Vai su **aistudio.google.com** con il tuo account Google → **Get API key → Create API key**.
2. Copiala nell'app: ⚙️ Impostazioni → ✨ Riassunto notizie con l'IA → **Salva**.

Il piano gratuito ha un limite di richieste al giorno, che Google cambia spesso: basta per qualche titolo al giorno.

Se un giorno il riassunto smette di funzionare per "modello non trovato", in AI Studio guarda il nome di un modello "Flash" o "Flash-Lite" disponibile e scrivilo nel campo **Modello**.

---

## Passo 9 — Riporta i tuoi dati

Nella nuova app: ⚙️ Impostazioni → 💾 Backup → **📥 Importa**. Scegli il file salvato all'inizio, oppure incolla il testo.

---

## Cosa è vero e cosa è simulato

Sotto il prezzo di ogni titolo trovi un'etichetta:

- **✅ Prezzo vero · ora**: prezzo reale. Le fonti sono:
  - **Tradegate** (Borsa di Berlino), in tempo reale per molti ETF, ETC e titoli europei;
  - **Yahoo Finance**: quasi in tempo reale per le azioni USA, circa 15-20 minuti di ritardo per le Borse europee;
  - **CoinGecko** per le crypto;
  - l'**aggiornamento orario** del robot.
- **🎲 Simulato**: per alcuni titoli piccoli il robot non trova il prezzo vero e l'app continua con la simulazione.

Il prezzo di Tradegate può differire di qualche centesimo da quello di Borsa Italiana o della tua app.

---

## Manutenzione e problemi comuni

| Problema | Soluzione |
|---|---|
| I prezzi non si aggiornano da giorni | Scheda **Actions** del progetto: se il robot è in pausa premi **Enable workflow**; se c'è una ❌ apri l'esecuzione e leggi l'errore. Spesso è Yahoo temporaneamente bloccato: si risolve da solo. |
| «Il ponte non risponde» | Controlla l'indirizzo in `config.json` e in ⚙️ Impostazioni; prova il link di test del passo 4. |
| La sincronizzazione non funziona | La chiave potrebbe essere scaduta: creane una nuova (passo 6) e reinseriscila su ogni dispositivo e nel segreto `GIST_TOKEN`. |
| Le notifiche non arrivano ad app chiusa | Controlla i segreti `GIST_ID` e `GIST_TOKEN` (passo 7) e che nell'app ci sia il canale ntfy. |
| Voglio aggiornare l'app con una nuova versione | Carica il nuovo `index.html` su GitHub (Add file → Upload files): sostituisce il vecchio. I tuoi dati non si perdono. |

**Limiti dei servizi gratuiti** (più che sufficienti per un uso personale):
- Cloudflare Workers: 100.000 richieste al giorno.
- GitHub Actions: gratis per i progetti pubblici.
- CoinGecko: API pubblica con limiti al minuto.

**Uso personale:** i dati di Yahoo e Tradegate sono per uso personale. Non pubblicizzare il sito come servizio per altri.

---

*Regole fiscali e informazioni dell'app sono semplificate a scopo didattico: non sono consigli di investimento.*
