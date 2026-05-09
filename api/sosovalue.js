/**
 * SafeBridge AI - SoSoValue API Proxy
 * Vercel Function: /api/sosovalue
 *
 * Base URL matches official docs: https://openapi.sosovalue.com/openapi/v1
 *
 * Usage (endpoint = path after base, no leading slash):
 *   GET /api/sosovalue?endpoint=indices
 *   GET /api/sosovalue?endpoint=indices%2Fssimag7%2Fconstituents
 *   GET /api/sosovalue?endpoint=news&currency_id=...&page=1&page_size=20
 *   GET /api/sosovalue?endpoint=etfs
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

  const base = 'https://openapi.sosovalue.com/openapi/v1';
  const path = String(endpoint).replace(/^\/+/, '');
  const queryString = new URLSearchParams(params).toString();
  const url = `${base}/${path}${queryString ? '?' + queryString : ''}`;

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
