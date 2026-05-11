# SafeBridge AI

## Converting Fear into On-chain Action

> Bridging **tens of millions of S&P500 index-fund investors worldwide** (estimate) to crypto through **SoSoValue SSI**

🔗 **Live Demo**: [safebridge-ai.vercel.app](https://safebridge-ai.vercel.app)
🎬 **Demo Video (3 min, EN)**: _link added on submission (Day 3)_
📋 **API Usage Plan**: [`docs/api_usage_plan.md`](docs/api_usage_plan.md)  
🧭 **Dynamic UI → data lineage (for judges)**: [`docs/judge_dynamic_display_matrix.md`](docs/judge_dynamic_display_matrix.md)

### For Judges (60-second path)
- Open the live demo and run `MAG7.ssi` first.
- Confirm the loading-stage **Diagnosis pipeline** shows real API steps (`✓ / ⚠ / ✗`, timing).
- On results, check the **S&P500-framed risk signal + SBSI + clear SSI CTA**.
- The S&P500 bar compares **relative volatility (a familiar benchmark)** — it does **not** claim day-to-day price correlation with equities.
- If one API is unstable, verify the app still finishes via graceful fallback.
- Check the **Quick Decision** block: it is computed from volatility, bias quiz adjustment, and live-data quality status (`Live/Partial/Fallback`), not a static sentence.
- Architecture strategy: Wave 1 intentionally stays lean; Wave 2 separates data/diagnosis/presentation/tracking; Wave 3 adds policy validation and observability hardening.

---

## 🎯 The Problem

**Tens of millions of investors globally hold S&P500 index funds.**

**But only a small minority of them also own crypto.**

Why retail index-fund investors hesitate (recurring themes from public investor sentiment surveys):
- It feels too risky / scary
- It's hard to understand
- Fear of losing money

SafeBridge AI is built around exactly these three barriers.

SafeBridge AI solves this by:
- ✅ Comparing crypto risk **against S&P500 volatility as a psychological benchmark** (relative risk translation, not a correlation claim)
- ✅ Scoring safety using **live market data** plus **ETF flow signals from SoSoValue** (MAG7.ssi path) when available
- ✅ Providing **plain-language AI recommendations**
- ✅ **Guiding users to SoSoValue SSI** for safer entry

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔴🟡🟢 **SBSI Score** | SafeBridge Sentiment Index (0–100) adjusted for index fund investors |
| 📊 **S&P500 Comparison** | Risk expressed as a multiple of a familiar **volatility** benchmark (not a promise that prices move together) |
| 🔍 **Safety Layer** | Live vs fallback data checks, optional ETF flow readout (SoSoValue), behavioral bias quiz |
| 🤖 **AI Recommendation** | Plain-language action advice via OpenRouter, with inline `[#N]` citations that scroll to the matching news row |
| 📰 **Investor Safety Feed** | Top-5 SoSoValue news items, each tagged **Risk-up / Risk-down / Watch** with a one-line S&P500-investor takeaway from the same AI call |
| 📈 **Backtest (Wave 1 proxy)** | 90-day return and max drawdown from price history as quick evidence (full signal backtest planned for Wave 2) |
| 🎯 **SSI Onboarding** | Direct guidance to **SoSoValue MAG7.ssi** |

---

## 🏗 Architecture (Wave 1)

```
User Input (SSI ticker / custom token) + optional bias quiz
                          ↓
┌──────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  • CoinGecko    — coins/{id}/market_chart (90d)          │
│  • SoSoValue    — indices, constituents,                 │
│                   market-snapshot, news,                 │
│                   etfs/summary-history (MAG7 only)       │
│  All calls proxied through Vercel Functions (/api/*)     │
└─────────────────────────────┬────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────┐
│              Processing & UI (result.html)               │
│  • 7-tier risk signal vs S&P500 volatility multiple      │
│  • SBSI 0–100, adjusted by ETF flow, momentum, bias quiz │
│  • Layer Scorecard (safety / action / 90d backtest)      │
│  • Agentic live pipeline log (✓ / ⚠ / ✗ + ms timing)     │
└─────────────────────────────┬────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────┐
│                 AI Recommendation                        │
│  OpenRouter (openai/gpt-3.5-turbo)                       │
│  → templateAdvice() deterministic fallback on failure    │
└─────────────────────────────┬────────────────────────────┘
                              ↓
                Result Page + SSI CTA
```

> **Key Innovation:** Plain-language risk framing for index-fund investors, with a direct path to **SoSoValue SSI** (e.g. MAG7.ssi) instead of leaving users at “I’m still scared.”

---

## 📊 Impact

### Market Size (estimates, Wave 1)
- **Global target:** Tens of millions of S&P500 index-fund investors worldwide (estimate based on public ETF / index-fund participation data)
- **Initial focus:** Asia-Pacific retail investors
- **Potential SSI buyers:** Order-of-magnitude estimate in the low millions, assuming a single-digit-percent conversion of the addressable index-fund audience
- **Typical competitor target:** Pro / active crypto traders (a much smaller, already-converted audience), vs. SafeBridge AI which targets the much larger index-fund crowd

### Contribution to SoSoValue
- **Direct SSI onboarding** driving revenue
- Opening untapped retail investor segments
- Healthier crypto market ecosystem

---

## 🛠 Tech Stack

- **Frontend:** HTML / CSS / JavaScript (Vanilla)
- **AI:** OpenRouter API (default: GPT; other models configurable in `api/openrouter.js`)
- **Data:** SoSoValue Open API (`indices`, `indices/{id}/constituents`, `indices/{id}/market-snapshot`, `news`; plus `etfs/summary-history` with `symbol` + `country_code` on MAG7.ssi). CoinGecko (`market_chart` for volatility and drawdown).
- **Deployment:** Vercel (auto-deploy via GitHub)
- **i18n:** EN (Wave 1) / JA (Wave 2) / ZH (Wave 3)

---

## 🚀 Setup

### 1. Clone the repository

```bash
git clone https://github.com/mnrj-vv-w/safebridge-ai.git
cd safebridge-ai
```

### 2. Configure environment variables

Create a `.env` file:

```env
# Get your API keys from:
# SoSoValue: https://sosovalue.com/api
# CoinGecko: https://www.coingecko.com/api
# OpenRouter: https://openrouter.ai/keys

SOSOVALUE_API_KEY=your_sosovalue_key_here
COINGECKO_API_KEY=your_coingecko_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

⚠️ Never commit your `.env` file.

### 3. Run locally

```bash
npx serve .
```

### 4. Deploy

Push to `main` → Vercel auto-deploys

---

## 🔌 API Usage

| API | Endpoints Used (Wave 1) | Purpose |
|---|---|---|
| **SoSoValue** | `openapi/v1`: `indices`, `indices/{ticker}/constituents`, `indices/{ticker}/market-snapshot`, `news`, `etfs/summary-history?symbol=&country_code=` (proxied via `/api/sosovalue?endpoint=…`) | SSI composition, price/momentum, news volume & attention proxy; US ETF aggregate net inflow (MAG7 path) |
| **CoinGecko** | `coins/{id}/market_chart` | 90-day volatility, 30d return, max drawdown vs S&P500 vol baseline |
| **OpenRouter** | Chat completions (`openai/gpt-3.5-turbo` in code) | Plain-language recommendation text |

> Full API plan (Wave 1 in production + Wave 2 SoDEX candidates + auth / rate-limit / fallback policies): **[`docs/api_usage_plan.md`](docs/api_usage_plan.md)**

---

## 🎯 Supported paths

SafeBridge AI is designed around the **MAG7.ssi** path, which is the demo flow we recommend reviewers walk first.

| Path | Status (Wave 1) | Notes |
|---|---|---|
| **MAG7.ssi** | ✅ Recommended demo path | All five SoSoValue endpoints + CoinGecko + OpenRouter wired end-to-end, including the US ETF flow tile |
| MEME.ssi | ✅ Live | Same pipeline minus the ETF flow tile (no comparable single-asset ETF anchor) |
| DEFI.ssi | ✅ Live | Same pipeline minus the ETF flow tile |
| Custom token (e.g. `BTC`, `SOL`) | ✅ Live (degraded) | CoinGecko-based volatility / drawdown only; SoSoValue tiles fall back |
| Unknown / unsupported string | ✅ Graceful fallback | Reference profile is shown with a clear warning |

---

## ⚠ Known limitations (Wave 1)

- **No wallet, no execution.** SafeBridge AI is read-only by design; we do not connect to wallets or place orders this wave. The "next step" is an outbound link to SoSoValue SSI.
- **Quick-evidence backtest only.** Layer 4 currently shows 90-day return + max drawdown of an anchor asset as a confidence proxy. A full per-signal historical backtest engine is on the Wave 2 roadmap below.
- **Single LLM model.** Recommendations run through `openai/gpt-3.5-turbo` via OpenRouter; multi-model voting and the cross-signal agent land in Wave 2.
- **Manual SSI mapping.** SSI display tickers are mapped to anchor coins (e.g. MAG7 → BTC) for the volatility math; this list is currently hardcoded and will be made data-driven in Wave 2.
- **Audience-size figures are estimates.** Numbers in "Market Size" are order-of-magnitude estimates derived from public ETF / index-fund participation data, not commissioned market research.

---

## 🔒 Security

- ✅ Read-only tool
- ✅ No wallet connection
- ✅ No personal data stored
- ✅ HTTPS enforced

---

## 🗓 Roadmap

Aligned with the official SoSoValue × AKINDO Buildathon 2026 Wave focus statements.

### Wave 1 — Concept Validation *(this submission)*
*Official Focus: idea, target users, use case, API usage plan, workflow, early prototype.*

- ✅ End-to-end live MAG7.ssi diagnosis using **5 SoSoValue endpoints** + CoinGecko + OpenRouter
- ✅ **SBSI 0–100 score** with behavioral-bias adjustment from the 3-question quiz
- ✅ **7-tier risk signal** anchored on S&P500 volatility multiple
- ✅ **Layer Scorecard** (safety / action / 90-day backtest proxy)
- ✅ **Agentic live pipeline log** showing each API hop with success / partial / fail status
- ✅ **Investor Safety Feed** — top-5 SoSoValue news rows with Risk-up / Risk-down / Watch tags and per-row S&P500-investor takeaways; AI recommendation cites them inline as `[#N]` anchors
- ✅ Direct **SSI onboarding CTA** (MAG7.ssi) as the explicit next step
- ✅ Graceful degradation on every external dependency (`Full live` / `Partial` / `Fallback` pill)
- ✅ PWA shell (manifest + service worker) for static-shell offline reload
- ✅ [`docs/api_usage_plan.md`](docs/api_usage_plan.md) covering all current + planned endpoints
- ✅ **Lightweight UX impact pack** (keep Wave1 as early prototype): quiz time expectation, clearer selection state, minimum readability floor, and a quick decision summary strip on the result first-view

### Wave 2 — Build Phase I *(May 18 – May 29)*
*Official Focus: core feature development, SoSoValue API integration, **initial SoDEX API or execution module integration**, interactive prototype.*

- 🔲 **Initial SoDEX integration** (read-only `24h_volume`, `tvl`, `latest_swap`) surfaced as a new Detailed Analysis tile
- 🔲 **Cross-Signal Agent** — LLM does horizontal reasoning across SoSoValue + CoinGecko + SoDEX in one prompt and flags conflicting signals
- 🔲 Deeper SoSoValue surface: whale activity / DAT / additional sentiment indices
- 🔲 Full per-signal historical backtest engine replacing the Wave 1 90-day proxy
- 🔲 Multilingual UI (JA) on top of the existing EN baseline
- 🔲 Data-driven SSI ↔ anchor-coin mapping (remove the hardcoded list)
- 🔲 **UX measurement phase**: core analytics instrumentation + CTA color A/B test (`result_view → cta_click_sosovalue`)
- 🔲 **Weighted scoring v1**: introduce explicit signal weights (volatility / momentum / flow / bias) as a documented model

### Wave 3 — Build Phase II *(Jun 4 – Jun 15)*
*Official Focus: risk control, confirmation mechanism, security awareness, polished demo.*

- 🔲 **Risk control** — server-side validation that re-checks LLM output against numeric inputs before display
- 🔲 **Confirmation mechanism** — second-opinion read from SoDEX latest swap before the SSI CTA fires
- 🔲 **Security awareness** module: explicit checklist (no wallet / no key custody / read-only sources)
- 🔲 Multilingual UI (ZH)
- 🔲 Polished demo + Demo Day storyline
- 🔲 **Major UX restructuring**: result first-view redesign (conclusion-first hierarchy) based on Wave2 measurement
- 🔲 **Policy-table decision engine**: replace branching heuristics with auditable rule tables
- 🔲 **Backtest threshold validation**: verify score/risk cutoffs against multi-period historical outcomes

> UX planning docs: [`docs/設計書/UI/README.md`](docs/設計書/UI/README.md), [`docs/設計書/UI/ux_wireframe_v1.md`](docs/設計書/UI/ux_wireframe_v1.md), [`docs/設計書/UI/analytics_event_dictionary_v1.md`](docs/設計書/UI/analytics_event_dictionary_v1.md), [`docs/設計書/UI/event_payload_template_v1.md`](docs/設計書/UI/event_payload_template_v1.md)

---

## 🏆 Why SafeBridge Wins

| Other Teams | SafeBridge |
|---|---|
| Tech & features | **Market size × SoSoValue contribution** |
| Pro / active crypto traders (already converted) | **Index-fund investors worldwide (much larger, untapped pool)** |
| Indirect SSI | **Direct SSI onboarding** |

> Audience-size figures above are order-of-magnitude estimates intended to frame the opportunity, not precise market research.

---

## Media credits

**Demo / presentation BGM:** Music by [Viacheslav Starostin](https://pixabay.com/users/starostin-46826676/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=484374) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=484374) (track id 484374).

---

## 📄 License

Apache 2.0

---

## 🙏 Built For

**SoSoValue × AKINDO Buildathon 2026**

---

## 🔗 Links

- [Live Demo](https://safebridge-ai.vercel.app)
- [SoSoValue](https://sosovalue.com)
- [MAG7.ssi](https://sosovalue.com/indices/mag7)
