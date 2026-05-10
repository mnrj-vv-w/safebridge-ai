/**
 * SafeBridge AI - OpenRouter API Proxy
 * Vercel Function: /api/openrouter
 *
 * Usage:
 *   POST /api/openrouter
 *   Body: { ticker, riskScore, etfFlow, safetyScore, volatilityMultiple, signal, indexMomentum?, newsFeedTotal?, newsAttention? }
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

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
  } = req.body || {};

  // Build prompt for AI
  const prompt = `You are SafeBridge AI, a crypto risk advisor for traditional index fund investors (people who know S&P500 and ETFs but find crypto intimidating).

Live signals for ${ticker}:
- Risk Score: ${riskScore}/100  (Overall Signal: ${signal})
- Project Safety Score: ${safetyScore}/100
- S&P500 Volatility Multiple: ${volatilityMultiple}x (if S&P500 drops -5%, this could drop ~-${(5 * volatilityMultiple).toFixed(0)}% to -${(5 * volatilityMultiple * 1.5).toFixed(0)}%)
- Institutional ETF Flow this week: ${etfFlow}
- Index momentum (SoSoValue 24h snapshot): ${indexMomentum}
- Related news volume (SoSoValue news feed total): ${newsFeedTotal}
- News attention index (0-100, our engagement proxy): ${newsAttention}

Write a 3-4 sentence plain-language recommendation for someone who:
- Owns an S&P500 index fund
- Is considering crypto for the first time
- Is cautious and risk-aware

Hard rules (follow ALL of them):
1. The first sentence MUST anchor on the S&P500 volatility multiple in plain English (e.g. "behaves like the S&P500 but ${volatilityMultiple}x more volatile").
2. You MUST explicitly mention at least TWO of these live signals by name in the body, weaving them into the reasoning (not just listing them): the 24h index momentum (${indexMomentum}), the news volume / attention (${newsFeedTotal} headlines, attention ${newsAttention}/100), and the ETF flow (${etfFlow}). If a value is "N/A" you may skip that one.
3. End with a specific, actionable suggestion sized to the risk band (e.g. "start with 2-3% of your portfolio" for higher risk; "you can scale a bit higher" for lower risk).
4. The final sentence MUST remind the reader to keep their S&P500 index fund running untouched (e.g. "Keep your S&P500 index fund running as the core").
5. Do NOT use jargon like "DeFi", "on-chain", "smart contract", "TVL", "alpha".
6. Keep the whole response under 110 words and never invent numbers that are not in the data above.`;

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
        max_tokens: 200,
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
    const message = data.choices?.[0]?.message?.content || 'Unable to generate recommendation.';

    return res.status(200).json({ recommendation: message });

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch from OpenRouter API',
      detail: error.message,
    });
  }
}
