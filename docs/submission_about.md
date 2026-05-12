## What it does

SafeBridge AI is a lightweight “fear-to-action” guide for **index-fund investors** who find crypto intimidating: it turns hesitation into **clear next steps**, not hype.

Users pick a crypto ticker or a **SoSoValue SSI** (e.g. MAG7.ssi, MEME.ssi, DEFI.ssi), answer **three behavioral bias questions** (skippable), and get:

- A **7-tier overall risk signal** framed against **S&P 500–style volatility**
- **SBSI (SafeBridge Sentiment Index)** — a 0–100 readout aligned with that framing
- **S&P 500 benchmark context** — a **volatility multiple** vs a familiar baseline (relative risk translation, **not** a claim that prices move in lockstep with equities day-to-day), plus a **Layer 2–4 scorecard** on the results page (**Safety · Action · Backtest proxy** — Wave 1 uses a 90-day proxy where noted)
- An **Investor Safety Feed** of the top **five** SoSoValue news rows, tagged **Risk-up / Risk-down / Watch**, with per-row takeaways from the **same OpenRouter** JSON response (deterministic heuristics backfill if the model omits rows)
- A **plain-language AI recommendation** via **OpenRouter** (separate card below the fold; cites `[#N]` anchors into the feed when news rows exist)
- **Direct guidance** to explore SSIs on **SoSoValue** (execution happens on their official site; this app does not custody assets or place trades)
- A **quick decision-first result flow** (Wave 1 lightweight UX impact): first-view summary before deeper cards

*Disclaimer: educational / informational simulation — not personalized financial advice.*

**Judge quick-check in one sentence:**  
SafeBridge does three things fast: **translate risk into S&P500 language**, **explain why with live data**, and **point to a concrete SSI next step on SoSoValue**.

**Quick Decision vs AI (judge-readable):**  
The **Quick Decision** card at the top is **rule-based on live diagnosis state** (not a static script): (1) volatility vs S&P500 baseline, (2) behavioral-bias quiz adjustment, and (3) data-quality status (`Live` / `Partial` / `Fallback`) to output an action stance, sizing hints, and confidence. A separate **AI Recommendation** block below uses **OpenRouter** for plain-language narrative and news citations—so judges can distinguish deterministic “what now” from LLM prose.

---

## The problem it solves

Many Americans still don’t hold crypto—and among **non-holders**, comprehension and trust gaps dominate. In the National Cryptocurrency Association’s **2025 Crypto Confidence Pulse** (The Harris Poll, **n = 2,000 U.S. adults who do not hold cryptocurrency**), respondents cite **lack of understanding of how crypto works** as the **biggest barrier to entry** (**49%**), while **43%** flag concerns about **security and fraud**.

**Source:** [Business Wire — NCA release](https://www.businesswire.com/news/home/20250722391613/en/New-Report-Reveals-Lack-of-Understanding-is-Holding-Back-Wider-U.S.-Crypto-Adoption)

Crypto adoption and motivations **vary widely by country** (regulation, banking access, remittances, etc.). Still, **index-oriented investors** in developed markets often stall on the same friction: **intuitive risk framing** and **trust**—not a shortage of tickers.

SafeBridge AI bridges that gap by expressing risk in **S&P 500–familiar volatility terms** (a benchmark for “how bumpy” it feels), surfacing **behavioral biases** before they drive decisions, and steering cautious users toward **SoSoValue SSI** as a structured first step—**without** pretending to replace a diversified core portfolio.

---

## Challenges I ran into

Merging **CoinGecko** prices/volatility with **SoSoValue** ETF/index hints into one credible story—without leaking API keys—meant **Vercel proxies**, careful fallbacks, and honest Wave‑1 limits (e.g. **90‑day proxy** vs a full backtest later).

---

## Technologies I used

**Vanilla HTML/CSS/JS**, **Vercel serverless** (`/api/coingecko`, `/api/sosovalue`, `/api/openrouter`), **CoinGecko**, **SoSoValue**, **OpenRouter**, plus **sessionStorage** for quiz → results.

**Judge / reviewer deep dive (every dynamic block → data → code):**  
[`docs/judge_dynamic_display_matrix.md`](
https://github.com/mnrj-vv-w/safebridge-ai/blob/main/docs/judge_dynamic_display_matrix.md)

---

## How we built it

Pick **SSI/ticker** → optional **3-question bias quiz** → results: **S&P 500–style volatility framing** (benchmark multiple, not a correlation claim), bias-adjusted risk score, **Layer 2–4 scorecard** (Safety / Action / Backtest proxy), **Investor Safety Feed** + **OpenRouter** output (`recommendation` + per-row `news`), and a **SoSoValue SSI CTA**.

## Judge-facing proof points (Wave 1)

- **Real integration, not mockups:** five SoSoValue endpoints are already wired on the MAG7 path.
- **Workflow visibility:** diagnosis pipeline exposes each API hop with `✓ / ⚠ / ✗` and timing.
- **User value clarity:** non-trader users get a defensible “what now” flow, not execution UI.
- **Honest scope control:** read-only by design in Wave 1; deeper execution/risk-control deferred to later waves.
- **Engineering roadmap discipline:** we keep Wave 1 stable, then refactor in stages (Wave 2 modular split, Wave 3 policy/observability hardening) to scale features without regression.

---

## What we learned

**Benchmarks beat jargon**; **biases belong in the score**; ship a **reliable vertical slice** before perfect analytics.

---

## What’s next for SafeBridge AI

Wave 2 focuses on **personalization + Macro market context**: profile-aware recommendations, FOMC/CPI/jobs event-window analysis for BTC/ETH/MAG7.ssi, initial SoDEX read integration, and beginner micro-learning blocks tied to each decision.

Wave 3 focuses on **risk control + completion**: policy-table decision rules, AI output validation, loss/stress simulation, Crypto-stocks-vs-S&P500 cross analysis, multi-horizon backtest views, and final UX/demo polish.

Scope discipline: we intentionally keep NFT pledge minting, full community features, and full monetization implementation as post-Wave-3 options; fundraising-impact analysis enters only as a limited case-study after core risk-control is complete.