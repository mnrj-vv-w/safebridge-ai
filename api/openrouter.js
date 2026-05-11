/**
 * SafeBridge AI - OpenRouter API Proxy
 * Vercel Function: /api/openrouter
 *
 * Usage:
 *   POST /api/openrouter
 *   Body: {
 *     ticker, riskScore, etfFlow, safetyScore, volatilityMultiple, signal,
 *     indexMomentum?, newsFeedTotal?, newsAttention?,
 *     newsRows?: Array<{ idx, title, src }>   // top-5 SoSoValue news rows
 *   }
 *
 * Response:
 *   {
 *     recommendation: string,
 *     news: Array<{ idx: number, tag: 'risk-up'|'risk-down'|'watch', meaning: string }>
 *   }
 */

function normalizeNewsTag(t) {
  const s = String(t || '').toLowerCase().trim();
  if (s === 'risk-up' || s === 'risk_up' || s === 'riskup') return 'risk-up';
  if (s === 'risk-down' || s === 'risk_down' || s === 'riskdown') return 'risk-down';
  return 'watch';
}

function heuristicTagFromNewsTitle(title) {
  const t = String(title || '').toLowerCase();
  if (/hack|exploit|lawsuit|\bsec\b|ban\b|crash|dump|liquidat|bear|loss|fraud|stolen|outflow|tariff|emergency|selloff/.test(t)) {
    return 'risk-up';
  }
  if (/rally|surge|record|inflow|bull|breakthrough|\ball-?time\b|won\b/.test(t)) {
    return 'risk-down';
  }
  return 'watch';
}

const HEURISTIC_MEANING = {
  'risk-up': 'Rougher crypto headline vibe; keep any add tiny next to your index core.',
  'risk-down': 'Friendlier tone; still treat crypto as a small satellite only.',
  watch: 'Routine crypto chatter; do not act on this headline alone.',
};

function clampMeaningWords(str, maxWords) {
  const parts = String(str || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return parts.slice(0, maxWords).join(' ');
}

/**
 * Prefer LLM per-row annotations; fill missing or empty meaning with SafeBridge heuristics.
 */
function mergeNewsAnnotations(safeNewsRows, llmNews) {
  const n = safeNewsRows.length;
  if (!n) return [];
  const llmByIdx = new Map();
  for (const item of llmNews || []) {
    if (!item || typeof item !== 'object') continue;
    const idx = Number(item.idx);
    if (!Number.isFinite(idx) || idx < 1 || idx > n) continue;
    llmByIdx.set(idx, item);
  }
  const out = [];
  for (let i = 1; i <= n; i++) {
    const title = safeNewsRows[i - 1]?.title || '';
    const fallbackTag = heuristicTagFromNewsTitle(title);
    let tag = fallbackTag;
    let meaning = HEURISTIC_MEANING[fallbackTag] || HEURISTIC_MEANING.watch;

    const llm = llmByIdx.get(i);
    if (llm) {
      const rawM = typeof llm.meaning === 'string' ? llm.meaning.trim() : '';
      const m = clampMeaningWords(rawM, 14);
      if (m) {
        meaning = m;
        const t = normalizeNewsTag(llm.tag);
        if (t === 'risk-up' || t === 'risk-down' || t === 'watch') tag = t;
      }
    }
    out.push({ idx: i, tag, meaning });
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const {
    ticker = 'MAG7.ssi',
    riskScore = 65,
    etfFlow = '+$2.2B',
    safetyScore = 72,
    volatilityMultiple = 2.1,
    signal = 'neutral',
    indexMomentum = 'N/A',
    newsFeedTotal = 'N/A',
    newsAttention = 'N/A',
    newsRows = [],
  } = req.body || {};

  const safeNewsRows = Array.isArray(newsRows)
    ? newsRows
        .filter(r => r && typeof r === 'object')
        .slice(0, 5)
        .map((r, i) => ({
          idx: Number.isFinite(Number(r.idx)) ? Number(r.idx) : (i + 1),
          title: String(r.title || '').slice(0, 200),
          src: String(r.src || '').slice(0, 80)
        }))
    : [];

  const newsBlock = safeNewsRows.length
    ? safeNewsRows.map(r => `#${r.idx} (${r.src || 'source N/A'}) ${r.title}`).join('\n')
    : '(no news rows available)';

  const newsRowCount = safeNewsRows.length;
  const newsJsonExample = newsRowCount > 0
    ? `  "news": [\n${safeNewsRows.map(r => `    { "idx": ${r.idx}, "tag": "watch", "meaning": "<=14 words>" }`).join(',\n')}\n  ]`
    : `  "news": []`;

  const prompt = `You are SafeBridge AI, a crypto risk advisor for traditional index fund investors (people who know S&P500 and ETFs but find crypto intimidating).

Live signals for ${ticker}:
- Risk Score: ${riskScore}/100  (Overall Signal: ${signal})
- Project Safety Score: ${safetyScore}/100
- S&P500 Volatility Multiple: ${volatilityMultiple}x (if S&P500 drops -5%, this could drop ~-${(5 * volatilityMultiple).toFixed(0)}% to -${(5 * volatilityMultiple * 1.5).toFixed(0)}%)
- Institutional ETF Flow this week: ${etfFlow}
- Index momentum (SoSoValue 24h snapshot): ${indexMomentum}
- Related news volume (SoSoValue news feed total): ${newsFeedTotal}
- News attention index (0-100, our engagement proxy): ${newsAttention}

Top-5 SoSoValue news rows (use idx to cite):
${newsBlock}

Return ONLY a single JSON object with this exact shape (no markdown, no commentary):
{
  "recommendation": "<3-4 sentence plain-language recommendation>",
${newsJsonExample}
}

Hard rules (follow ALL of them):
1. The first sentence MUST anchor on the S&P500 volatility multiple in plain English (e.g. "behaves like the S&P500 but ${volatilityMultiple}x more volatile").
2. You MUST explicitly mention at least TWO of these live signals by name in the body, weaving them into the reasoning (not just listing them): the 24h index momentum (${indexMomentum}), the news volume / attention (${newsFeedTotal} headlines, attention ${newsAttention}/100), and the ETF flow (${etfFlow}). If a value is "N/A" you may skip that one.
3. End with a specific, actionable suggestion sized to the risk band (e.g. "start with 2-3% of your portfolio" for higher risk; "you can scale a bit higher" for lower risk).
4. The final sentence MUST remind the reader to keep their S&P500 index fund running untouched (e.g. "Keep your S&P500 index fund running as the core").
5. Do NOT use jargon like "DeFi", "on-chain", "smart contract", "TVL", "alpha".
6. Keep the recommendation under 110 words and never invent numbers that are not in the data above.
7. If at least one news row exists, cite at least ONE news item by its index using the literal token "[#N]" (e.g. "[#1]") inside the recommendation body.
8. If ${newsRowCount} news row(s) were provided above, the "news" array MUST contain exactly ${newsRowCount} object(s), one per idx from 1 to ${newsRowCount} inclusive, each with keys idx, tag, meaning. Never return an empty "news" array when ${newsRowCount} > 0.
9. Each "meaning" is at most 14 words, plain English, from an S&P500 index-fund investor perspective; tag is one of risk-up|risk-down|watch. If no news rows were provided, return "news": [].`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://safebridge-ai.vercel.app',
        'X-Title': 'SafeBridge AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        max_tokens: 560,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `OpenRouter API error: ${response.status}`,
        detail: errorText,
      });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';

    let recommendation = '';
    let news = [];

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.recommendation === 'string') {
          recommendation = parsed.recommendation.trim();
        }
        if (Array.isArray(parsed.news)) {
          news = parsed.news
            .filter(n => n && typeof n === 'object')
            .map(n => ({
              idx: Number(n.idx),
              tag: typeof n.tag === 'string' ? n.tag : 'watch',
              meaning: typeof n.meaning === 'string' ? n.meaning : ''
            }))
            .filter(n => Number.isFinite(n.idx) && n.idx >= 1 && n.idx <= safeNewsRows.length);
        }
      }
    } catch {
      const recMatch = raw.match(/"recommendation"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      if (recMatch) {
        recommendation = recMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ').trim();
      } else if (raw.trim()) {
        recommendation = raw.trim();
      }
    }

    if (!recommendation) recommendation = 'Unable to generate recommendation.';

    const newsMerged = mergeNewsAnnotations(safeNewsRows, news);

    return res.status(200).json({ recommendation, news: newsMerged });

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch from OpenRouter API',
      detail: error.message,
    });
  }
}
