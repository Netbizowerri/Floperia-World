import type { VercelRequest, VercelResponse } from './types';

/**
 * POST /api/privyr
 * Proxies lead data to Privyr CRM webhook.
 * This Vercel Serverless Function replaces the Express route in server.ts.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, phone, notes, lead_source } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    lead_source?: string;
  };

  const PRIVYR_URL = 'https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/85ZKSbJQ';

  try {
    const response = await fetch(PRIVYR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'Anonymous',
        email: email || '',
        phone: phone || '',
        notes: notes || '',
        lead_source: lead_source || 'Floperia Website',
      }),
    });

    const responseText = await response.text();
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : { rawResponse: '' };
    } catch {
      data = { rawResponse: responseText };
    }

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(response.status).json({ success: false, error: data });
    }
  } catch (error) {
    console.error('[api/privyr] Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to connect to Privyr' });
  }
}
