# SafeBridge AI — API Usage Plan

> Operational plan for every external API SafeBridge AI talks to, today and through Wave 3. Maintained as the canonical reference for the official **Wave 1 Focus: "API usage plan"** evaluation item.
>
> Companion docs: [`README.md`](../README.md), [`docs/wave毎対応計画.md`](./wave毎対応計画.md)

---

## 1. Wave 1 — Currently integrated (live in `safebridge-ai.vercel.app`)

All external APIs are reached through Vercel Functions under `/api/*` so that secrets never reach the browser. Failures degrade gracefully through `safeFetchJson` (single attempt, no retry, structured `{ ok, error }` returns). When data is missing, the UI shows fallback labels and tags the *Live pill* as `Partial` instead of `Full live`.

### 1.1 SoSoValue Open API — primary data source

| # | Endpoint (after `https://openapi.sosovalue.com/openapi/v1`) | Where it is called | Used for |
|---|---|---|---|
| 1 | `GET /indices` | `result.html` `runDiagnosis()` step 2 | Resolve display ticker (e.g. `MAG7.ssi`) → official `indexTicker` (`ssimag7`) |
| 2 | `GET /indices/{indexTicker}/constituents` | same step | Basket composition, weights, top constituent → drives news filter & ETF anchor |
| 3 | `GET /indices/{indexTicker}/market-snapshot` | parallel with news | 24h % change → SBSI sentiment adjustment |
| 4 | `GET /news?currency_id={top}&page=1&page_size=20` | parallel with snapshot | News volume + SafeBridge attention proxy (likes / impressions) |
| 5 | `GET /etfs/summary-history?symbol=BTC&country_code=US` | MAG7 path only | Latest US ETF aggregate net flow shown in the SoSo card |

- **Auth**: `x-soso-api-key: <SOSOVALUE_API_KEY>` header, injected by `api/sosovalue.js`.
- **Caching**: none on the proxy. Browser session reuse only (single diagnosis = one fetch each).
- **Rate handling**: any non-`200` is surfaced as a `Partial` data row in the live pipeline log; the UI keeps running with the remaining sources.
- **Fallback UX**: missing snapshot → SBSI sentiment delta becomes 0; missing news → attention/volume tiles show `—`; missing ETF → tile shows the explanatory help copy instead of a number.

### 1.2 CoinGecko API — risk math baseline

| Endpoint | Where | Used for |
|---|---|---|
| `GET /coins/{id}/market_chart?vs_currency=usd&days=90` | `result.html` `runDiagnosis()` step 1 | 90-day daily returns → annualized volatility, 30-day return, max drawdown |

- **Auth**: `x-cg-demo-api-key: <COINGECKO_API_KEY>` header, injected by `api/coingecko.js`.
- **`{id}` mapping**: SSI display tickers map to a representative anchor coin (e.g. MAG7 → BTC) so the comparison vs S&P 500 volatility is always anchored on a liquid asset.
- **Fallback UX**: on failure, the volatility multiple, drawdown, and 30d return slots fall back to the conservative reference profile baked into `result.html`, and the live pipeline log marks the step `⚠`.

### 1.3 OpenRouter — natural-language recommendation

| Endpoint | Where | Used for |
|---|---|---|
| `POST https://openrouter.ai/api/v1/chat/completions` (model: `openai/gpt-3.5-turbo`) | `api/openrouter.js`, called from `result.html` after numeric scoring is complete | Plain-language 3–4 sentence recommendation tailored for index-fund investors |

- **Auth**: `Authorization: Bearer <OPENROUTER_API_KEY>` plus `HTTP-Referer` + `X-Title` for OpenRouter attribution.
- **Prompt inputs** (passed from the page so the LLM cannot hallucinate the numbers): `ticker`, `riskScore`, `volatilityMultiple`, `etfFlow`, `safetyScore`, `signal`, `indexMomentum`, `newsFeedTotal`, `newsAttention`.
- **Fallback UX**: any failure (network, 4xx/5xx, missing key) triggers `templateAdvice()` in `result.html`, which assembles a deterministic recommendation from the same numeric inputs so the user always sees a recommendation card.

### 1.4 Vercel Function proxies — security & shape

All three proxies share the same shape:

```
/api/sosovalue?endpoint=<encoded path>&...
/api/coingecko?endpoint=<encoded path>&...
/api/openrouter   (POST JSON)
```

Reasons: keep keys server-side, normalize errors into `{ error, detail }` so the page can show a single `safeFetchJson` failure mode, and let us add per-route caching later without touching the front end.

### 1.5 Required environment variables

| Variable | Where set | Notes |
|---|---|---|
| `SOSOVALUE_API_KEY` | Vercel Project → Environment Variables | Read by `api/sosovalue.js`. Required for indices / constituents / snapshot / news / etfs. |
| `COINGECKO_API_KEY` | Vercel | Read by `api/coingecko.js`. Demo key tier is sufficient for current call volume. |
| `OPENROUTER_API_KEY` | Vercel | Read by `api/openrouter.js`. Account must have credit for `openai/gpt-3.5-turbo`. |

If any one is missing, the corresponding Vercel function returns `{ error: 'API key not configured' }` and the page shows a `Partial` live pill plus a fallback recommendation — the page itself never breaks.

---

## 2. Wave 2 — Planned integrations

Mapped to the official Wave 2 focus statement: *"Core feature development, SoSoValue API integration, **initial SoDEX API or execution module integration**, interactive prototype."*

### 2.1 SoDEX (initial integration — defining feature for Wave 2)

Per the official SoDEX docs the **read endpoints below are public and require no authentication**, which is a deliberate fit for our no-wallet, no-key-storage UX.

| Candidate endpoint | Purpose in SafeBridge AI | UI surface (planned) |
|---|---|---|
| `GET /dex/{chain}/24h_volume` | Aggregate 24h DEX volume for the chain hosting the basket's top constituent | New "DEX activity" tile inside Detailed Analysis |
| `GET /dex/{chain}/tvl` | Cross-check liquidity depth before recommending a position | Tooltip on the DEX activity tile |
| `GET /dex/{chain}/latest_swap` | Sanity check that the chain is alive (recent swap timestamp) | Live status dot in the DEX tile |

- **No auth**, no key in `.env` for read-only use → integration risk is dependency uptime, not credentials.
- **Rate handling**: same `safeFetchJson` pattern; failure degrades the DEX tile only, not the rest of the page.
- **Out of scope for Wave 1**: confirmed by the official timeline that initial SoDEX integration belongs to Wave 2.

### 2.2 Deeper SoSoValue surface

Picked to support the Wave 2 "Cross-Signal Agent" that does horizontal reasoning across data sources.

| Candidate endpoint | Purpose |
|---|---|
| `whale activity` (e.g. `/onchain/whale-tx`) | Detect concentration risk — "the price moved but only 2 wallets did it" |
| `DAT (Digital Asset Treasury)` related feeds | Institutional positioning context for MAG7 |
| Additional sentiment indices | Cross-check our news-based attention proxy with SoSoValue's own sentiment |

Each new endpoint lands behind the same `/api/sosovalue?endpoint=…` proxy so no extra secrets management is required.

### 2.3 Cross-Signal Agent (LLM consumer of all of the above)

Same OpenRouter call, but the prompt is rewritten to take SoSoValue + CoinGecko + SoDEX in one payload and emit a *consistency-checked* recommendation (e.g. "ETF flow is positive but DEX volume is collapsing → downgrade signal"). No new API endpoint, but the input shape grows; documented here so the data wiring stays auditable.

---

## 3. Wave 3 — Planned integrations

Mapped to *"Risk control, confirmation mechanism, security awareness"* and the final demo.

| Track | API direction |
|---|---|
| Risk control | Add a server-side validation layer that re-checks the LLM output against the numeric inputs before display (no new external API). |
| Confirmation mechanism | Optional read-only on-chain price check (e.g. SoDEX latest swap) used as a "second opinion" before the user clicks the SSI link. |
| Security awareness | Static security checklist; no live API. |

No new external dependencies are planned for Wave 3 beyond what is already integrated in Waves 1–2; the focus is hardening the existing surface.

---

## 4. Cross-cutting policies

### 4.1 Authentication

- All keys live in **Vercel Project Environment Variables**, never in client code or in the repo.
- Per-API headers (`x-soso-api-key`, `x-cg-demo-api-key`, `Authorization: Bearer`) are injected exclusively inside `api/*.js` Vercel Functions.

### 4.2 Rate limits & retries

- No automatic retry — a failed call is reported as `Partial` in the live pipeline log so the judge can see what degraded.
- Single diagnosis = at most 1 call per CoinGecko endpoint, ≤5 calls to SoSoValue, ≤1 call to OpenRouter. Well inside free / demo tiers.
- If we ever hit a sustained rate limit, the planned mitigation is in-memory caching at the Vercel Function layer keyed by `(endpoint, params, minute)` — not implemented in Wave 1 because volume does not require it.

### 4.3 Fallback UX (live pill semantics)

| Pill state | Meaning |
|---|---|
| `Full live` | All requested endpoints returned successfully for this diagnosis. |
| `Partial` | At least one source degraded; the affected tile shows fallback text and the diagnosis still completes. |
| `Fallback` | Major data source(s) failed; numeric scoring uses the reference profile and the recommendation comes from `templateAdvice()` instead of OpenRouter. |

### 4.4 Privacy

- No wallet connection, no PII collection, no cookies beyond `sessionStorage` for the bias quiz answer (cleared on tab close).
- Outbound calls are server-side only; the browser sees `/api/*` URLs.

---

## 5. Change log

| Date | Change |
|---|---|
| 2026-05-10 | Initial version covering Wave 1 live integrations and Wave 2 / Wave 3 candidates. |
