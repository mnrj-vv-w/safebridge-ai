# SafeBridge AI

## Converting Fear into On-chain Action

> Bridging **70+ million S&P500 investors worldwide** to crypto through **SoSoValue SSI**

🔗 **Live Demo**: [safebridge-ai.vercel.app](https://safebridge-ai.vercel.app)

---

## 🎯 The Problem

**70+ million investors globally hold S&P500 index funds.**

**But less than 5% own crypto.**

Why?
- Scared (68%)
- Don't understand (52%)
- Fear of losing money (47%)

SafeBridge AI solves this by:
- ✅ Comparing crypto risk **directly against S&P500**
- ✅ Scoring safety using **institutional data (VC, ETF flows)**
- ✅ Providing **plain-language AI recommendations**
- ✅ **Guiding users to SoSoValue SSI** for safer entry

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔴🟡🟢 **SBSI Score** | SafeBridge Sentiment Index (0–100) adjusted for index fund investors |
| 📊 **S&P500 Comparison** | Risk expressed as a multiple of familiar benchmarks |
| 🔍 **Safety Layer** | VC backer verification, ETF flow analysis |
| 🤖 **AI Recommendation** | Plain-language action advice via OpenRouter |
| 📈 **Backtest** | Historical signal accuracy vs S&P500 |
| 🎯 **SSI Onboarding** | Direct guidance to **SoSoValue MAG7.ssi** |

---

## 🏗 Architecture

```
User Input (Token / SSI name)
        ↓
┌─────────────────────────────────────┐
│          Data Layer                 │
│  • SoSoValue API (9 modules)        │
│  • CoinGecko API                    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│       Processing Layer              │
│  Layer 1: Macro (S&P500)            │
│  Layer 2: SBSI Score                │
│  Layer 3: AI Action                 │
│  Layer 4: Backtest Layer            │
│  Layer 5: SSI Guidance              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│        OpenRouter AI                │
│     (Claude / GPT)                  │
└──────────────┬──────────────────────┘
               ↓
          Result Page
               ↓
    [SoSoValue MAG7.ssi] Button
```

> **Key Innovation:** Layer 4 (SSI Onboarding) directly converts user fear into SoSoValue revenue through MAG7.ssi guidance.

---

## 📊 Impact

### Market Size
- **Global target:** 70+ million S&P500 index fund investors
- **Initial focus:** Asia-Pacific retail investors
- **Potential SSI buyers:** 3.5 million (5% conversion rate)
- **Competitor target:** 50,000 pro traders globally

### Contribution to SoSoValue
- **Direct SSI onboarding** driving revenue
- Opening untapped retail investor segments
- Healthier crypto market ecosystem

---

## 🛠 Tech Stack

- **Frontend:** HTML / CSS / JavaScript (Vanilla)
- **AI:** OpenRouter API (Claude / GPT)
- **Data:** SoSoValue API (9 modules), CoinGecko API
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

```

### 3. Run locally

```bash
npx serve .
```

### 4. Deploy

Push to `main` → Vercel auto-deploys

---

## 🔌 API Usage

| API | Endpoints Used | Purpose |
|---|---|---|
| **SoSoValue** | `/currencies`, `/etfs`, `/indices` | Price, ETF flows, SSI index data |
| **CoinGecko** | `/coins/{id}/market_chart` | S&P500 correlation analysis |
| **OpenRouter** | `claude-3-haiku`, `gpt-3.5-turbo` | Plain-language recommendations |

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
| **Wave 1** | SBSI, SSI onboarding, live demo |
| **Wave 2** | Real data validation, backtest, multilingual (JA) |
| **Wave 3** | PWA, community features, global expansion (ZH) |

---

## 🏆 Why SafeBridge Wins

| Other Teams | SafeBridge |
|---|---|
| Tech & features | **Market size × SoSoValue contribution** |
| 50K traders | **70M+ investors globally** |
| Indirect SSI | **Direct SSI onboarding** |

---

## 📄 License

Apache 2.0

---

## 🙏 Built For

**SoSoValue × AKINDO Frontier Hackathon 2026**

---

## 🔗 Links

- [Live Demo](https://safebridge-ai.vercel.app)
- [SoSoValue](https://sosovalue.com)
- [MAG7.ssi](https://sosovalue.com/indices/mag7)
```
