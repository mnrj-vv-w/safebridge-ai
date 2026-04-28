# SafeBridge AI 🌉

> AI-powered crypto risk assessment for traditional index fund investors

**Compare crypto assets with S&P500 — in plain language you already understand.**

🔗 **Live Demo**: [safebridge-ai.vercel.app](https://safebridge-ai.vercel.app)

---

## What is SafeBridge AI?

SafeBridge AI is built for investors who understand S&P500 and index funds, but find crypto intimidating.

Instead of showing raw on-chain data, SafeBridge AI:
- Compares crypto risk **directly against S&P500**
- Scores project safety using **VC backers, TVL, and ETF flows**
- Gives a clear **"what should I do?"** recommendation powered by AI
- Shows **backtest results** so you can trust the signal

> "If S&P500 drops -5%, this SSI index could drop -10~25%. Here's what to do."

---

## Key Features

| Feature | Description |
|---|---|
| 🔴🟡🟢 Risk Score | Intuitive signal light scoring (0–100) |
| 📊 S&P500 Comparison | Risk expressed as a multiple of familiar benchmarks |
| 🔍 Safety Layer | VC backer verification, fund flow analysis |
| 🤖 AI Recommendation | Plain-language action advice via OpenRouter |
| 📈 Backtest | Historical signal accuracy vs S&P500 |
| 🔒 Security Guide | Built-in safety checklist for crypto beginners |

---

## Architecture

```
User Input (SSI / Token name)
        ↓
┌─────────────────────────────┐
│     Data Layer              │
│  SoSoValue API (9 modules)  │
│  CoinGecko API              │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│     Processing Layer        │
│  Layer 1: Macro (S&P500)    │
│  Layer 2: Safety Score      │
│  Layer 3: Action (AI)       │
│  Layer 4: Backtest          │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│     OpenRouter AI           │
│  (Claude / GPT)             │
└────────────┬────────────────┘
             ↓
     Result Page Display
```

---

## Tech Stack

- **Frontend**: HTML / CSS / JavaScript (Vanilla)
- **AI**: OpenRouter API (Claude / GPT)
- **Data**: SoSoValue API, CoinGecko API
- **Deployment**: Vercel (auto-deploy via GitHub)
- **i18n**: EN (Wave 1) / JA (Wave 2) / ZH (Wave 3)

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/mnrj-vv-w/safebridge-ai.git
cd safebridge-ai
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
SOSOVALUE_API_KEY=your_sosovalue_api_key
COINGECKO_API_KEY=your_coingecko_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

### 3. Run locally

No build step required. Open `index.html` directly in your browser, or use a local server:

```bash
npx serve .
```

### 4. Deploy

Push to `main` branch → Vercel auto-deploys within 30 seconds.

---

## API Usage

| API | Purpose | Module |
|---|---|---|
| SoSoValue API | Price, ETF flows, VC backers, SSI index data | Currency, ETF, Fundraising, Index, Feeds |
| CoinGecko API | S&P500 comparison, historical price data | /coins/{id}/history |
| OpenRouter API | AI-generated plain-language recommendations | claude-3-haiku / gpt-3.5-turbo |

---

## Security

SafeBridge AI is a **read-only** tool.

- ✅ No wallet connection required
- ✅ No personal data collected or stored
- ✅ No signing or transactions involved
- ✅ HTTPS enforced via Vercel
- ✅ API keys stored server-side only

---

## Roadmap

| Wave | Goals |
|---|---|
| Wave 1 (May 1–12) | Core UI, SoSoValue API integration, live demo |
| Wave 2 (May 18–29) | Full 4-layer analysis, backtest, JA language support |
| Wave 3 (Jun 4–15) | UX polish, ZH support, final demo video |

---

## Built For

**SoSoValue × AKINDO Buildathon 2026**
- Platform: [app.akindo.io](https://app.akindo.io)
- Powered by: SoSoValue API · CoinGecko · OpenRouter

---

## License

Apache 2.0 — See [LICENSE](./LICENSE) for details.
