/**
 * SafeBridge AI - CoinGecko API Proxy
 * Vercel Function: /api/coingecko
 *
 * Usage:
 *   GET /api/coingecko?endpoint=coins/bitcoin/market_chart&vs_currency=usd&days=180
 *   GET /api/coingecko?endpoint=simple/price&ids=bitcoin&vs_currencies=usd
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint parameter is required' });
  }

  const apiKey = process.env.COINGECKO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Build query string
  const queryString = new URLSearchParams(params).toString();
  const url = `https://api.coingecko.com/api/v3/${endpoint}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-cg-demo-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `CoinGecko API error: ${response.status}`,
        detail: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch from CoinGecko API',
      detail: error.message,
    });
  }
}
