## What it does

SafeBridge AI is a lightweight “fear-to-action” guide for index-fund investors who find crypto intimidating.

Users select a ticker or SoSoValue SSI (MAG7.ssi / MEME.ssi / DEFI.ssi), optionally answer a 3-question behavioral-bias quiz, and receive:
- a 7-tier risk signal in S&P500-familiar **volatility** language,
- SBSI (0-100),
- a Layer 2-4 scorecard (Safety / Action / Backtest proxy),
- a top-5 Investor Safety Feed from SoSoValue news,
- an OpenRouter plain-language recommendation,
- and a clear CTA to SoSoValue SSI.

The S&P500 reference is a volatility benchmark for translation, not a claim of day-to-day price correlation.

Quick Decision (top card) is deterministic and rule-based; AI Recommendation is a separate narrative block. This separation keeps decision logic auditable while still providing readable guidance.

*Disclaimer: educational / informational simulation, not personalized financial advice.*

---

## The problem it solves

Many non-holders still avoid crypto because of comprehension and trust gaps.  
In the 2025 NCA Crypto Confidence Pulse (Harris Poll, n=2,000 U.S. adults who do not hold crypto), 49% cited lack of understanding and 43% cited security/fraud concerns.

Source: [Business Wire — NCA release](https://www.businesswire.com/news/home/20250722391613/en/New-Report-Reveals-Lack-of-Understanding-is-Holding-Back-Wider-U.S.-Crypto-Adoption)

SafeBridge addresses this by translating risk into familiar benchmark terms, incorporating behavioral-bias awareness, and giving one concrete next step on SoSoValue SSI.

---

## Challenges I ran into

The main challenge was combining CoinGecko and SoSoValue signals into one credible explanation while keeping API keys secure.  
We solved this with Vercel proxy functions, explicit fallback states, and clear Wave 1 scope limits (90-day proxy evidence vs full backtest engine later).

---

## Technologies I used

Vanilla HTML/CSS/JS, Vercel serverless (`/api/coingecko`, `/api/sosovalue`, `/api/openrouter`), CoinGecko, SoSoValue, OpenRouter, and sessionStorage for quiz-to-result carryover.

Judge deep-dive (dynamic block -> data -> code):  
[`docs/judge_dynamic_display_matrix.md`](https://github.com/mnrj-vv-w/safebridge-ai/blob/main/docs/judge_dynamic_display_matrix.md)

---

## How we built it

Flow: SSI/ticker select -> optional 3-question bias quiz -> result page with volatility-framed risk, bias-adjusted score, Layer scorecard, Investor Safety Feed, OpenRouter recommendation, and SoSoValue SSI CTA.

## Judge-facing proof points (Wave 1)

- Real API integration (not mock): five SoSoValue endpoints are wired on the MAG7 path.
- Transparent workflow: diagnosis pipeline shows each API hop with `✓ / ⚠ / ✗` and timing.
- Practical user outcome: a defensible “what now” flow for non-trader users.
- Scope honesty: Wave 1 is read-only by design; deeper risk-control and product completion are staged in later waves.

---

## What we learned

Benchmarks beat jargon, behavioral bias must be part of the score, and a reliable vertical slice wins before full analytics perfection.

---

## What’s next for SafeBridge AI

Wave 2: personalization v1, Macro event-window analysis (FOMC/CPI/jobs), initial SoDEX read integration, cross-signal reasoning v1, and beginner micro-learning cards.

Wave 3: risk-control core (policy-table rules, AI output validation, loss/stress simulation), Crypto Stocks x S&P500 cross analysis, multi-horizon backtest views, and final UX/demo polish.

Scope discipline: NFT pledge minting, full community features, and full monetization implementation are post-Wave-3 options. Fundraising-impact analysis is treated as a limited case study after core risk-control is complete.