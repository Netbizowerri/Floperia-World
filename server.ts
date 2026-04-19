import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;
  app.use(cors());
  app.use(express.json());

  // API Route for sending emails via Resend
  app.post("/api/send-email", async (req, res) => {
    console.log("[SERVER] POST /api/send-email hit");
    const { to, subject, html } = req.body;
    
    if (!to || !subject || !html) {
      console.error("[SERVER] Missing required fields:", { to, subject, hasHtml: !!html });
      return res.status(200).json({ success: false, error: "Missing required fields" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("[SERVER] Missing RESEND_API_KEY");
      return res.status(200).json({ success: false, error: "Email service not configured" });
    }

    try {
      console.log(`[SERVER] Attempting to send email to: ${to}`);
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: typeof to === 'string' ? [to] : to,
          subject: subject,
          html: html,
        }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { rawResponse: responseText };
      }

      console.log(`[SERVER] Resend API Status: ${response.status}`, data);

      if (response.ok) {
        console.log("[SERVER] Email sent successfully");
        res.status(200).json({ success: true, data });
      } else {
        console.error("[SERVER] Resend API Error Detail:", JSON.stringify(data, null, 2));
        res.status(200).json({ 
          success: false, 
          error: data, 
          resendStatusCode: response.status,
          message: data.message || "Resend API validation error. Ensure you are sending to your verified email."
        });
      }
    } catch (error) {
      console.error("[SERVER] Internal Email Error:", error);
      res.status(200).json({ success: false, error: error instanceof Error ? error.message : "Internal server error" });
    }
  });

  // API Route for Privyr Webhook
  app.post("/api/privyr", async (req, res) => {
    console.log("[SERVER] POST /api/privyr hit");
    const { name, email, phone, notes, lead_source } = req.body;
    
    // Webhook URL provided by user
    const PRIVYR_URL = "https://www.privyr.com/api/v1/incoming-leads/0vZfjMQw/85ZKSbJQ";

    try {
      const response = await fetch(PRIVYR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "Anonymous",
          email: email || "",
          phone: phone || "",
          notes: notes || "",
          lead_source: lead_source || "Floperia Website",
        }),
      });

      const data = await response.json();
      console.log("[SERVER] Privyr API Response:", data);

      if (response.ok) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(response.status).json({ success: false, error: data });
      }
    } catch (error) {
      console.error("[SERVER] Privyr Error:", error);
      res.status(500).json({ success: false, error: "Failed to connect to Privyr" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Floperia Backend running on http://localhost:${PORT}`);
    console.log(`[SERVER] Resend API Key configured: ${!!process.env.RESEND_API_KEY}`);
  });
}

startServer();
