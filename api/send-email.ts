import type { VercelRequest, VercelResponse } from './types';

/**
 * POST /api/send-email
 * Sends admin notification email via Resend API.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body as { to?: string | string[]; subject?: string; html?: string };
  const adminEmail = process.env.ADMIN_EMAIL || 'service.floperia@gmail.com';

  if (!subject || !html) {
    return res.status(400).json({ success: false, error: 'Missing required fields: subject, html' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('[api/send-email] RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, error: 'Email service not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Floperia Classic World <onboarding@resend.dev>',
        to: typeof to === 'string' ? [to] : Array.isArray(to) && to.length > 0 ? to : [adminEmail],
        subject,
        html,
      }),
    });

    const responseText = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { rawResponse: responseText };
    }

    if (response.ok) {
      return res.status(200).json({ success: true, data });
    }

    console.error('[api/send-email] Resend error:', data);
    return res.status(200).json({ success: false, error: data });
  } catch (error) {
    console.error('[api/send-email] Internal error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
