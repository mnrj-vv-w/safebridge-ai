/**
 * SafeBridge AI - OpenRouter API Proxy
 * Vercel Function: /api/openrouter
 *
 * Usage:
 *   POST /api/openrouter
 *   Body: { ticker, riskScore, etfFlow, safetyScore, volatilityMultiple, signal }
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
  } = req.body || {};

  // Build prompt for AI
  const prompt = `You are SafeBridge AI, a crypto risk advisor for traditional index fund investors (people who know S&P500 and ETFs but find crypto intimidating).

Based on this data for ${ticker}:
- Risk Score: ${riskScore}/100
- S&P500 Volatility Multiple: ${volatilityMultiple}x (if S&P500 drops -5%, this could drop -${(5 * volatilityMultiple).toFixed(0)}% to -${(5 * volatilityMultiple * 1.5).toFixed(0)}%)
- Institutional ETF Flow this week: ${etfFlow}
- Project Safety Score: ${safetyScore}/100
- Overall Signal: ${signal}

Write a short, plain-language recommendation (3-4 sentences max) for someone who:
- Has an S&P500 index fund
- Is considering crypto for the first time
- Is cautious and risk-aware

Rules:
- Use familiar comparisons (like "similar to S&P500 but X times more volatile")
- End with a specific, actionable suggestion (e.g., "start with 2-3% of your portfolio")
- Always remind them to keep their index fund running
- Do NOT use jargon like "DeFi", "on-chain", "smart contract"
- Keep it under 100 words`;

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
