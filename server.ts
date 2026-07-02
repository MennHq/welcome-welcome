import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Helper to get styled email templates depending on recipient and purpose
  function getMailOptions(
    toEmail: string, 
    smtpEmail: string, 
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
              <a href="https://dl.dropboxusercontent.com/scl/fi/zuoragfk0qhvgwdluvtra/15-Min-CookBook-For-Bussy-Moms.pdf?rlkey=vkwann8a81uxbviji2ye70fbf" 
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
            <p style="color: #4B5563; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">You can securely download your digital PDF of the <strong>15-Minute Cookbook for Busy Moms</strong> using the beautiful link below. Save it directly to your phone, tablet, or computer.</p>
            
            <div style="text-align: center; margin-bottom: 40px;">
              <a href="https://dl.dropboxusercontent.com/scl/fi/zuoragfk0qhvgwdluvtra/15-Min-CookBook-For-Bussy-Moms.pdf?rlkey=vkwann8a81uxbviji2ye70fbf" 
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

      if (!smtpEmail || !smtpPassword) {
        return res.status(500).json({ error: "SMTP configuration is missing. Please set SMTP_EMAIL and SMTP_PASSWORD in your environment variables." });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      const mailOptions = getMailOptions(email, smtpEmail, isGift, recipientName, personalNote);

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Email sent successfully" });

    } catch (error: any) {
      console.error("Email sending error:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
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
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: smtpEmail, pass: smtpPassword },
          });
          const mailOptions = getMailOptions(email, smtpEmail, isGiftRequest(req, email));
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
