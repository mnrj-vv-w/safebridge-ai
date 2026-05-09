# SafeBridge AI

## Converting Fear into On-chain Action

> Bridging **tens of millions of S&P500 index-fund investors worldwide** (estimate) to crypto through **SoSoValue SSI**

🔗 **Live Demo**: [safebridge-ai.vercel.app](https://safebridge-ai.vercel.app)

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
- ✅ Comparing crypto risk **directly against S&P500**
- ✅ Scoring safety using **live market data** plus **ETF flow signals from SoSoValue** (MAG7.ssi path) when available
- ✅ Providing **plain-language AI recommendations**
- ✅ **Guiding users to SoSoValue SSI** for safer entry

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔴🟡🟢 **SBSI Score** | SafeBridge Sentiment Index (0–100) adjusted for index fund investors |
| 📊 **S&P500 Comparison** | Risk expressed as a multiple of familiar benchmarks |
| 🔍 **Safety Layer** | Live vs fallback data checks, optional ETF flow readout (SoSoValue), behavioral bias quiz |
| 🤖 **AI Recommendation** | Plain-language action advice via OpenRouter |
| 📈 **Backtest (Wave 1 proxy)** | 90-day return and max drawdown from price history as quick evidence (full signal backtest planned for Wave 2) |
| 🎯 **SSI Onboarding** | Direct guidance to **SoSoValue MAG7.ssi** |

---

## 🏗 Architecture (Wave 1)

```
User Input (Token / SSI name) + optional bias quiz
        ↓
┌─────────────────────────────────────┐
│          Data Layer                 │
│  • CoinGecko: 90d prices (vol, DD)  │
│  • SoSoValue: ETF list (MAG7.ssi)   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│       Processing & UI               │
│  Risk tiers (7-band) vs S&P500 vol  │
│  SBSI score + scenario text          │
│  Layer scorecard (safety / action / │
│    90d backtest proxy)               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│        OpenRouter AI                │
│     (GPT via OpenRouter)            │
└──────────────┬──────────────────────┘
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
- **Data:** SoSoValue API (Wave 1: ETF-related endpoint for institutional flow hint on MAG7.ssi), CoinGecko API (`market_chart` for volatility and drawdown)
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
| **SoSoValue** | `GET .../v1/etf/list` (via `/api/sosovalue?endpoint=etf/list`) | Institutional flow hint for MAG7.ssi diagnosis path |
| **CoinGecko** | `coins/{id}/market_chart` | 90-day volatility, 30d return, max drawdown vs S&P500 vol baseline |
| **OpenRouter** | Chat completions (`openai/gpt-3.5-turbo` in code) | Plain-language recommendation text |

---

## 🔒 Security

- ✅ Read-only tool
- ✅ No wallet connection
- ✅ No personal data stored
- ✅ HTTPS enforced

---

## 🗓 Roadmap

| Wave | Goals |
|---|---|
| **Wave 1** | SBSI, SSI onboarding, live demo, PWA shell, SoSoValue + CoinGecko live path with fallbacks |
| **Wave 2** | Deeper SoSoValue/SSI data, full backtest engine, multilingual (JA) |
| **Wave 3** | Community features, global expansion (ZH) |

---

## 🏆 Why SafeBridge Wins

| Other Teams | SafeBridge |
|---|---|
| Tech & features | **Market size × SoSoValue contribution** |
| Pro / active crypto traders (already converted) | **Index-fund investors worldwide (much larger, untapped pool)** |
| Indirect SSI | **Direct SSI onboarding** |

> Audience-size figures above are order-of-magnitude estimates intended to frame the opportunity, not precise market research.

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
