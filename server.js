
const express = require("express");
const app = express();
app.use(express.json());

// قائمة المنتجات – يمكنك التعديل عليها لاحقاً
let products = [
    { id: 1, nl: "BMW 3 Serie Motor N47", en: "BMW 3 Series Engine N47", brand: "BMW", price: 1250, stock: 3 },
    { id: 2, nl: "Audi A4 Voordeur Links", en: "Audi A4 Front Door Left", brand: "Audi", price: 295, stock: 2 }
];

// API (مطلوبة للوحة التحكم الاختيارية)
app.get("/api/products", (req, res) => res.json(products));
app.post("/api/products", (req, res) => { /* ... مثل السابق ... */ });
app.put("/api/products/:id", (req, res) => { /* ... */ });
app.delete("/api/products/:id", (req, res) => { /* ... */ });

// الصفحة الرئيسية – ARGOS
app.get("/", (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ARGOS Auto Onderdelen</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            h1 { color: #F97316; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #1a1a2e; color: white; padding: 12px; }
            td { padding: 10px; border-bottom: 1px solid #ddd; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚗 ARGOS Auto Onderdelen</h1>
            <p>Welkom bij ARGOS – uw specialist in gebruikte auto onderdelen.</p>
            <table>
                <tr><th>Onderdeel</th><th>Prijs</th><th>Voorraad</th></tr>`;
    products.forEach(p => {
        html += `<tr><td>${p.nl}</td><td>€${p.price}</td><td>${p.stock}</td></tr>`;
    });
    html += `
            </table>
            <div class="footer">📍 Magazijnweg 3, Alphen aan den Rijn | ✉️ sssssenator@gmail.com</div>
        </div>
    </body>
    </html>`;
    res.send(html);
});

// استخدم المنفذ الذي توفره Render
app.listen(process.env.PORT || 3000, () => {
    console.log("✅ ARGOS is live!");
});
