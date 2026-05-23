import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/checkout-session", async (req, res) => {
    try {
      const { items } = req.body;
      
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      const appId = process.env.CASHFREE_APP_ID || "TEST11082189031c6219ba1dea7ccb7098128011";
      const secretKey = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_test_8a401803678d7344737cc2b33222edf3_25cd8303";

      if (!appId || !secretKey) {
        throw new Error("Cashfree APP_ID or SECRET_KEY environment variable is missing.");
      }

      // Calculate total amount
      const orderAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Call Cashfree API Using Fetch
      const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
        method: "POST",
        headers: {
          "x-api-version": "2023-08-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          order_amount: orderAmount,
          order_currency: "INR",
          customer_details: {
            customer_id: "cust_123", // Dummy for guest checkout
            customer_name: "Guest User",
            customer_email: "guest@example.com",
            customer_phone: "9999999999" // 10 digit Indian number format
          },
          order_meta: {
            return_url: `${appUrl}?checkout_success=true&order_id={order_id}`
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
         console.error("Cashfree API failed:", data);
         throw new Error(data.message || "Failed to create Cashfree order");
      }

      res.json({ payment_session_id: data.payment_session_id });
    } catch (error: any) {
      console.error("Cashfree backend error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
