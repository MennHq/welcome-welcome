import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS Middleware to allow requests from cross-origin clients (e.g. Vercel deployments, local test apps)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Helper to detect if a request is for the Leilani Gift flow
  function isGiftRequest(req: express.Request, parsedEmail?: string): boolean {
    const gift = req.body.gift || req.query.gift;
    const isGift = req.body.isGift || req.query.isGift;
    const email = (parsedEmail || req.body.email || req.query.email || "").toLowerCase().trim();
    
    // Explicitly check for gift parameters or the specific recipient email
    return (
      email === "leilanikiana03@gmail.com" ||
      (typeof gift === 'string' && (gift.toLowerCase() === 'leilani' || gift.toLowerCase() === 'true')) ||
      (typeof isGift === 'string' && isGift.toLowerCase() === 'true') ||
      gift === true ||
      isGift === true
    );
  }

  const TOKEN_SECRET = process.env.TOKEN_SECRET || "15mincookbook-super-secure-token-signing-key-2026-xyz";

  function generateShortLivedToken(email: string): string {
    const expiry = Date.now() + 30 * 60 * 1000; // 30 minutes validity
    const payload = {
      email: email.toLowerCase().trim(),
      exp: expiry,
      salt: crypto.randomBytes(8).toString('hex')
    };
    const payloadStr = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadStr).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const hmac = crypto.createHmac('sha256', TOKEN_SECRET);
    hmac.update(base64Payload);
    const signature = hmac.digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return `${base64Payload}.${signature}`;
  }

  function getDownloadUrl(req: express.Request, email: string, token: string): string {
    let baseUrl = 'https://15minmeal.vercel.app';
    const reqHost = req.get('host') || '';
    if (
      reqHost.includes('localhost') || 
      reqHost.includes('127.0.0.1') || 
      reqHost.includes('ais-dev') || 
      reqHost.includes('ais-pre')
    ) {
      const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
      baseUrl = `${protocol}://${reqHost}`;
    }
    return `${baseUrl}/download?token=${token}`;
  }

  function verifyToken(token: string): { isValid: boolean; email?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return { isValid: false };

      const [base64Payload, signature] = parts;

      const hmac = crypto.createHmac('sha256', TOKEN_SECRET);
      hmac.update(base64Payload);
      const expectedSignature = hmac.digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      if (signature !== expectedSignature) {
        console.warn("Token signature mismatch!");
        return { isValid: false };
      }

      let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));

      if (payload && payload.exp && typeof payload.exp === 'number') {
        const isValid = Date.now() < payload.exp;
        return { isValid, email: payload.email };
      }
    } catch (e) {
      console.error("Token verification failed:", e);
    }
    return { isValid: false };
  }

  // Helper to get styled email templates depending on recipient and purpose
  function getMailOptions(
    toEmail: string, 
    smtpEmail: string, 
    downloadUrl: string,
    isGiftForce = false, 
    recipientName = "Leilani", 
    personalNote = ""
  ) {
    const isLeilani = isGiftForce || toEmail.toLowerCase().trim() === "leilanikiana03@gmail.com";
    
    if (isLeilani) {
      const highlightedName = (recipientName || "Leilani").trim();
      const optionalNoteHtml = personalNote && personalNote.trim() ? `
        <div style="background-color: #FFFDF9; border: 1px dashed #F43F5E; padding: 22px; border-radius: 12px; margin-bottom: 30px; font-style: italic; color: #57534E; line-height: 1.6; text-align: left; font-size: 16px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.01);">
          <strong style="color: #E11D48; font-style: normal; display: block; margin-bottom: 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">A personal note for you:</strong>
          "${personalNote.trim()}"
        </div>
      ` : '';

      return {
        from: `"15-Minute Cookbook Team" <${smtpEmail}>`,
        to: toEmail,
        subject: `A special recipe gift for ${highlightedName}! 🎁💖✨`,
        html: `
          <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF9F6; padding: 40px; border-radius: 16px; border: 1px solid #F3EFE9; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 70px; height: 70px; background-color: #FFE4E6; border-radius: 50%; line-height: 70px; font-size: 36px; margin-bottom: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">💖</div>
              <h1 style="color: #1F2937; font-family: Georgia, serif; font-size: 32px; font-weight: 500; margin: 0; line-height: 1.3;">A Special Gift for <span style="color: #F43F5E; font-weight: bold; border-bottom: 3px double #F43F5E; background-color: #FFE4E6; padding: 2px 10px; border-radius: 8px;">${highlightedName}</span>! ✨</h1>
            </div>
            
            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">Hi <span style="background-color: #FFE4E6; color: #E11D48; padding: 4px 10px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(244,63,94,0.05);">${highlightedName} ✨</span>,</p>
            
            ${optionalNoteHtml}

            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
              I hope this email brings a warm smile to your day! Someone incredibly thoughtful wanted to surprise you with this special gift copy of the <strong>15-Minute Cookbook for Busy Moms</strong>.
            </p>
            
            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">
              This digital cookbook is packed with delightful, quick family recipes designed to make cooking easy, stress-free, and absolutely delicious. You can download and save your PDF using the direct link below:
            </p>
            
            <div style="text-align: center; margin-bottom: 40px;">
              <a href="${downloadUrl}" 
                 style="display: inline-block; padding: 18px 36px; background-color: #F43F5E; color: white; text-decoration: none; border-radius: 9999px; font-family: Georgia, serif; font-size: 20px; font-weight: bold; box-shadow: 0 8px 16px rgba(244, 63, 94, 0.25); transition: background-color 0.2s;">
                Download Your Cookbook Gift 🎁
              </a>
            </div>
            
            <div style="background-color: #FFF5F5; border-left: 4px solid #F43F5E; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="color: #9F1239; font-weight: 600; font-size: 16px; margin: 0 0 8px 0;">💌 We would love your feedback!</p>
              <p style="color: #E11D48; font-size: 15px; line-height: 1.6; margin: 0;">
                Since this is a special surprise, we would absolutely love to hear how you like the recipes! Once you've had a chance to look through it or try a dish, feel free to reply directly to this email with your feedback and positive thoughts. We read and appreciate every single note!
              </p>
            </div>
            
            <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
              Wishing you beautiful moments and happy cooking! <br>
              <span style="color: #4B5563; font-weight: 600;">The 15-Minute Cookbook Team</span>
            </p>
          </div>
        `
      };
    } else {
      return {
        from: `"15-Minute Cookbook" <${smtpEmail}>`,
        to: toEmail,
        subject: 'Here is your 15-Minute Cookbook! 🥘✨',
        html: `
          <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF9F6; padding: 40px; border-radius: 16px; border: 1px solid #F3EFE9; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; width: 60px; height: 60px; background-color: #FFE4E6; border-radius: 50%; line-height: 60px; font-size: 30px; margin-bottom: 20px;">♥</div>
              <h1 style="color: #1F2937; font-family: Georgia, serif; font-size: 32px; font-weight: 500; margin: 0; line-height: 1.3;">Thank you for your order! 🎉</h1>
            </div>
            
            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">Hi there,</p>
            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">Your order was successful, and we are so excited to share these recipes with you and your family!</p>
            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">You can securely download your digital PDF of the <strong>15-Minute Cookbook for Busy Moms</strong> using the secure link below. Save it directly to your phone, tablet, or computer.</p>
            
            <div style="text-align: center; margin-bottom: 40px;">
              <a href="${downloadUrl}" 
                 style="display: inline-block; padding: 18px 36px; background-color: #F43F5E; color: white; text-decoration: none; border-radius: 9999px; font-family: Georgia, serif; font-size: 20px; font-weight: bold; box-shadow: 0 8px 16px rgba(244, 63, 94, 0.2); transition: background-color 0.2s;">
                Download E-Book PDF 🥘
              </a>
            </div>

            <div style="background-color: #FFF5F5; border-left: 4px solid #F43F5E; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="color: #9F1239; font-weight: 600; font-size: 16px; margin: 0 0 8px 0;">💌 We would love your feedback!</p>
              <p style="color: #E11D48; font-size: 15px; line-height: 1.6; margin: 0;">
                Once you've had a chance to try some of the meals, please reply directly to this email! We'd love to hear your thoughts, feedback, and success stories. Your support and positive energy mean everything to us!
              </p>
            </div>
            
            <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6; text-align: center; margin-top: 40px; border-top: 1px solid #E5E7EB; padding-top: 20px;">
              Happy cooking! <br>
              <span style="color: #4B5563; font-weight: 600;">The 15-Minute Cookbook Team</span>
            </p>
          </div>
        `
      };
    }
  }

  // In-memory cache to prevent duplicate email sends within a short time window (e.g., 2 minutes)
  const sentEmailsCache = new Map<string, number>();

  function shouldSendEmail(email: string): boolean {
    const key = email.toLowerCase().trim();
    const now = Date.now();
    const lastSent = sentEmailsCache.get(key);
    
    if (lastSent && (now - lastSent < 2 * 60 * 1000)) {
      // Sent within the last 2 minutes, don't send again
      return false;
    }
    
    // Update the timestamp
    sentEmailsCache.set(key, now);
    
    // Clean up old entries from the cache to prevent memory leaks
    for (const [cacheKey, timestamp] of sentEmailsCache.entries()) {
      if (now - timestamp > 5 * 60 * 1000) {
        sentEmailsCache.delete(cacheKey);
      }
    }
    
    return true;
  }

  // API constraints
  app.all("/api/send-email", async (req, res) => {
    try {
      const email = req.body.email || req.query.email;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email is required" });
      }

      const isGift = req.body.isGift === true || req.body.isGift === 'true' || req.query.isGift === 'true' || isGiftRequest(req, email);
      const recipientName = req.body.recipientName || req.query.recipientName || "Leilani";
      const personalNote = req.body.personalNote || req.query.personalNote || "";

      const smtpEmail = process.env.SMTP_EMAIL;
      const smtpPassword = process.env.SMTP_PASSWORD;

      const token = generateShortLivedToken(email);
      const downloadUrl = getDownloadUrl(req, email, token);

      if (!smtpEmail || !smtpPassword) {
        console.warn("SMTP configuration is missing. Returning token without sending email.");
        return res.json({ success: true, emailSent: false, message: "SMTP credentials missing. Proceeding with download token.", token });
      }

      if (!shouldSendEmail(email)) {
        console.log(`[Deduplication] Email to ${email} was already sent recently. Skipping SMTP send.`);
        return res.json({ success: true, emailSent: false, message: "Email already sent recently (de-duplicated).", token });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      const mailOptions = getMailOptions(email, smtpEmail, downloadUrl, isGift, recipientName, personalNote);

      try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, emailSent: true, message: "Email sent successfully", token });
      } catch (mailError: any) {
        console.error("Failed to send email via SMTP:", mailError);
        res.json({ success: true, emailSent: false, message: "Email send failed: " + mailError.message, token });
      }

    } catch (error: any) {
      console.error("Email sending error:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  // Test Email Endpoint (1-click send from /test route, no payment, no deduplication)
  app.post("/api/send-test-email", async (req, res) => {
    try {
      const email = req.body.email;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "A valid email address is required" });
      }

      const smtpEmail = process.env.SMTP_EMAIL;
      const smtpPassword = process.env.SMTP_PASSWORD;

      if (!smtpEmail || !smtpPassword) {
        return res.status(400).json({ 
          error: "SMTP configuration is missing on the server. Please add SMTP_EMAIL and SMTP_PASSWORD to your environment." 
        });
      }

      const token = generateShortLivedToken(email);
      const downloadUrl = getDownloadUrl(req, email, token);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      const mailOptions = getMailOptions(email, smtpEmail, downloadUrl, false);
      
      // Let's prepend "[TEST SEND]" to the subject to make it easy to identify
      mailOptions.subject = `[TEST SEND] ${mailOptions.subject}`;

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Test email sent successfully", token, downloadUrl });
    } catch (error: any) {
      console.error("Test email sending error:", error);
      res.status(500).json({ error: error.message || "Failed to send test email" });
    }
  });

  function findEmail(obj: any): string | null {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.email && typeof obj.email === 'string' && obj.email.includes('@')) return obj.email;
    if (obj.data && obj.data.email) return obj.data.email;
    if (obj.user && obj.user.email) return obj.user.email;
    if (obj.customer && obj.customer.email) return obj.customer.email;
    for (const key of Object.keys(obj)) {
      const val = findEmail(obj[key]);
      if (val) return val;
    }
    return null;
  }

  // In-memory logs for debugging webhooks
  const webhookLogs: any[] = [];

  // Middleware to log all API requests
  app.use("/api", (req, res, next) => {
    // Prevent the logging endpoint itself from polluting the logs
    if (req.url === '/logs' && req.method === 'GET') {
      return next();
    }
    
    webhookLogs.unshift({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    if (webhookLogs.length > 50) webhookLogs.pop();
    next();
  });

  // Whop webhook route
  app.post("/api/webhook/whop", async (req, res) => {
    console.log("Webhook received with headers:", req.headers);
    console.log("Webhook received with body:", JSON.stringify(req.body, null, 2));

    const email = findEmail(req.body);
    
    if (email) {
      try {
        const smtpEmail = process.env.SMTP_EMAIL;
        const smtpPassword = process.env.SMTP_PASSWORD;
        if (smtpEmail && smtpPassword) {
          if (!shouldSendEmail(email)) {
            console.log(`[Deduplication] Webhook email to ${email} was already sent recently. Skipping webhook SMTP send.`);
            return res.status(200).send("Webhook received, email already sent recently (de-duplicated)");
          }

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: smtpEmail, pass: smtpPassword },
          });
          const token = generateShortLivedToken(email);
          const downloadUrl = getDownloadUrl(req, email, token);

          const mailOptions = getMailOptions(email, smtpEmail, downloadUrl, isGiftRequest(req, email));
          await transporter.sendMail(mailOptions);
          console.log("Sent webhook email successfully to:", email);
          return res.status(200).send("Webhook received and email sent");
        } else {
          console.log("SMTP credentials missing");
          return res.status(500).send("SMTP credentials missing");
        }
      } catch (err) {
        console.error("Webhook email sending error:", err);
        return res.status(500).send("Webhook email sending error");
      }
    } else {
      console.log("No email found in webhook payload");
      return res.status(200).send("Webhook received but no email found in payload");
    }
  });

  // Debugging route to see recent webhooks
  app.get("/api/logs", (req, res) => {
    res.json(webhookLogs);
  });

  // Debugging route to clear recent webhooks
  app.delete("/api/logs", (req, res) => {
    webhookLogs.length = 0;
    res.json({ success: true });
  });

  // Verify secure cryptographically signed download token
  app.get("/api/verify-token", (req, res) => {
    const token = req.query.token;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ isValid: false, error: "Token parameter is required" });
    }
    const result = verifyToken(token);
    return res.json(result);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
