/**
 * SafeBridge AI - SoSoValue API Proxy
 * Vercel Function: /api/sosovalue
 *
 * Usage:
 *   GET /api/sosovalue?endpoint=index/list
 *   GET /api/sosovalue?endpoint=etf/list
 *   GET /api/sosovalue?endpoint=fundraising/projects&project_id=xxx
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

  // Get endpoint from query param
  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint parameter is required' });
  }

  // API Key from Vercel Environment Variables
  const apiKey = process.env.SOSOVALUE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Build query string
  const queryString = new URLSearchParams(params).toString();
  const url = `https://openapi.sosovalue.com/v1/${endpoint}${queryString ? '?' + queryString : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-soso-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `SoSoValue API error: ${response.status}`,
        detail: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch from SoSoValue API',
      detail: error.message,
    });
  }
}
