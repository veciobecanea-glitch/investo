// Ponte di "Impara a Investire" per Cloudflare Workers (piano gratuito).
// Copia tutto questo file nell'editor del Worker e premi "Deploy".
//
// Endpoint:
//   /tg?isin=IE00BK5BQT80,IE00B4L5Y983   prezzi in tempo reale da Tradegate (euro)
//   /yq?s=AAPL,VWCE.MI                      ultimo prezzo da Yahoo Finance (valuta originale)
//   /yh?s=AAPL&range=1y                     storico giornaliero da Yahoo Finance
//   /news?q=Nvidia&lang=it                  ultime notizie da Google News
//
// Facoltativo: in Settings > Variables aggiungi ALLOWED_ORIGIN con l'indirizzo del tuo sito
// (es. https://tuonome.github.io) per far usare il ponte solo alla tua app.

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "*").trim();
    const cors = {
      "Access-Control-Allow-Origin": allowed === "*" ? "*" : (origin.startsWith(allowed) ? origin : allowed),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (allowed !== "*" && origin && !origin.startsWith(allowed)) return json({ error: "origine non autorizzata" }, 403, cors);

    // piccola cache per non chiedere troppe volte la stessa cosa
    const cache = caches.default;
    const key = new Request(url.toString(), { method: "GET" });
    const hit = await cache.match(key);
    if (hit) { const r = new Response(hit.body, hit); Object.entries(cors).forEach(([k, v]) => r.headers.set(k, v)); return r; }

    let body, ttl = 30;
    try {
      if (url.pathname === "/tg") { body = await tradegate(list(url, "isin", 40)); ttl = 20; }
      else if (url.pathname === "/yq") { body = await yahooQuotes(list(url, "s", 40)); ttl = 30; }
      else if (url.pathname === "/yh") { body = await yahooHistory(url.searchParams.get("s"), url.searchParams.get("range") || "1y"); ttl = 3600; }
      else if (url.pathname === "/news") { body = await news(url.searchParams.get("q") || "", url.searchParams.get("lang") || "it"); ttl = 900; }
      else return json({ ok: true, info: "Ponte di Impara a Investire attivo. Endpoint: /tg /yq /yh /news" }, 200, cors);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 502, cors);
    }
    const res = json(body, 200, Object.assign({ "Cache-Control": "public, max-age=" + ttl }, cors));
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  },
};

function json(o, status, headers) {
  return new Response(JSON.stringify(o), { status, headers: Object.assign({ "Content-Type": "application/json; charset=utf-8" }, headers) });
}
function list(url, k, max) {
  return [...new Set((url.searchParams.get(k) || "").split(",").map(x => x.trim()).filter(Boolean))].slice(0, max);
}

async function tradegate(isins) {
  const out = {};
  await Promise.all(isins.map(async isin => {
    if (!/^[A-Z]{2}[A-Z0-9]{9}\d$/.test(isin)) return;
    try {
      const r = await fetch("https://www.tradegatebsx.com/refresh.php?isin=" + isin, { headers: { "User-Agent": UA, "Referer": "https://www.tradegatebsx.com/" } });
      if (!r.ok) return;
      const d = await r.json();
      const num = v => typeof v === "number" ? v : parseFloat(String(v).replace(/\./g, "").replace(",", "."));
      const last = num(d.last), close = num(d.close), bid = num(d.bid), ask = num(d.ask);
      const p = last > 0 ? last : (bid > 0 && ask > 0 ? (bid + ask) / 2 : NaN);
      if (p > 0) out[isin] = { p, pc: close > 0 ? close : p, bid: bid || null, ask: ask || null, ts: Date.now() };
    } catch (e) { }
  }));
  return out;
}

async function yahooQuotes(syms) {
  const out = {};
  await Promise.all(syms.map(async s => {
    try {
      const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s)}?range=5d&interval=1d`, { headers: { "User-Agent": UA } });
      if (!r.ok) return;
      const m = (await r.json()).chart.result[0].meta;
      if (m.regularMarketPrice > 0) out[s] = { p: m.regularMarketPrice, pc: m.chartPreviousClose || m.previousClose || m.regularMarketPrice, cur: m.currency, ts: (m.regularMarketTime || 0) * 1000 };
    } catch (e) { }
  }));
  return out;
}

async function yahooHistory(s, range) {
  if (!s || !/^(1mo|3mo|6mo|1y|2y|5y)$/.test(range)) throw new Error("parametri non validi");
  const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s)}?range=${range}&interval=1d`, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("Yahoo " + r.status);
  const res = (await r.json()).chart.result[0];
  const c = res.indicators.quote[0].close;
  const t = [], v = [];
  res.timestamp.forEach((ts, i) => { if (c[i] != null) { t.push(ts * 1000); v.push(c[i]); } });
  return { s, cur: res.meta.currency, t, v };
}

async function news(q, lang) {
  if (!q) return [];
  const loc = lang === "en" ? "hl=en-US&gl=US&ceid=US:en" : "hl=it&gl=IT&ceid=IT:it";
  const r = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}+when:14d&${loc}`, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error("News " + r.status);
  const xml = await r.text();
  const pick = (s, tag) => { const m = s.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)); return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : ""; };
  const dec = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  return xml.split("<item>").slice(1, 26).map(it => {
    let title = dec(pick(it, "title"));
    const source = dec(pick(it, "source"));
    if (source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3));
    return { title, link: pick(it, "link"), date: Date.parse(pick(it, "pubDate")) || 0, source };
  });
}
