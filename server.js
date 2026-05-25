const express = require("express");
const app = express();
app.use(express.json());

let products = [
    { id: 1, nl: "BMW Motor N47", en: "BMW Engine N47", brand: "bmw", price: 1250, stock: 3 },
    { id: 2, nl: "Mercedes Versnellingsbak", en: "Mercedes Gearbox", brand: "mercedes", price: 1850, stock: 1 },
    { id: 3, nl: "Audi Deur Links", en: "Audi Door Left", brand: "audi", price: 295, stock: 2 },
    { id: 4, nl: "VW Stuurinrichting", en: "VW Steering Rack", brand: "vw", price: 425, stock: 1 },
    { id: 5, nl: "Ford Motor 1.0", en: "Ford Engine 1.0", brand: "ford", price: 2200, stock: 1 }
];

app.get("/api/products", (req, res) => res.json(products));

app.post("/api/products", (req, res) => {
    let p = req.body; p.id = Date.now(); p.price = parseFloat(p.price); p.stock = parseInt(p.stock) || 1;
    products.push(p); res.json({ ok: true });
});

app.put("/api/products/:id", (req, res) => {
    let i = products.findIndex(x => x.id === parseInt(req.params.id));
    if (i > -1) { if (req.body.price) products[i].price = parseFloat(req.body.price); if (req.body.stock) products[i].stock = parseInt(req.body.stock); }
    res.json({ ok: true });
});

app.delete("/api/products/:id", (req, res) => {
    products = products.filter(x => x.id !== parseInt(req.params.id));
    res.json({ ok: true });
});

// ---------- ARGOS HOME PAGE ----------
app.get("/", (req, res) => res.send("<!DOCTYPE html><html><head><title>ARGOS</title><style>body{font-family:Arial;text-align:center;padding:50px;background:#f0f0f0}h1{color:#F97316;font-size:48px}.card{background:white;padding:30px;border-radius:20px;max-width:700px;margin:0 auto;box-shadow:0 10px 30px rgba(0,0,0,.1)}table{width:100%;border-collapse:collapse;margin:20px 0}th{background:#1a1a2e;color:white;padding:12px}td{padding:10px;border-bottom:1px solid #ddd}.btn{background:#1a1a2e;color:white;padding:12px 24px;border-radius:30px;text-decoration:none;font-weight:600;display:inline-block;margin-top:20px}</style></head><body><div class=card><h1>🚗 ARGOS</h1><h2 style=color:#22C55E>✅ Server draait!</h2><table><tr><th>Naam</th><th>Prijs</th><th>Voorraad</th></tr>" + products.map(p => "<tr><td>" + p.nl + "</td><td>€" + p.price + "</td><td>" + p.stock + "</td></tr>").join("") + "</table><a href=/admin class=btn>⚙️ Admin</a></div></body></html>"));

// ---------- ARGOS ADMIN PAGE ----------
app.get("/admin", (req, res) => res.send("<!DOCTYPE html><html><head><title>ARGOS Admin</title><style>:root{--p:#F97316;--s:#1a1a2e;--g:#22C55E;--r:#EF4444}*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial;background:#f1f5f9;padding:20px}.container{max-width:900px;margin:0 auto}.header{background:var(--s);color:white;padding:20px;border-radius:15px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}.header a{color:white;text-decoration:none;background:var(--p);padding:10px 20px;border-radius:8px}.card{background:white;padding:25px;border-radius:15px;margin-bottom:20px}.row{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px}input{width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:8px}button{padding:12px 25px;border:none;border-radius:8px;cursor:pointer;font-weight:600}.btn-add{background:var(--g);color:white;width:100%;font-size:16px}.btn-edit{background:var(--p);color:white;margin-right:5px}.btn-del{background:var(--r);color:white}table{width:100%;border-collapse:collapse}th{background:var(--s);color:white;padding:12px;text-align:left}td{padding:12px;border-bottom:1px solid #e2e8f0}@media(max-width:600px){.row{grid-template-columns:1fr}}</style></head><body><div class=container><div class=header><h1>⚙️ ARGOS Admin</h1><a href=/>🏠 Winkel</a></div><div class=card><h2>➕ Nieuw Product</h2><div class=row><input id=nl placeholder='Naam NL *'><input id=en placeholder='Name EN *'></div><div class=row><input id=brand placeholder='Merk *'><input id=price placeholder='Prijs € *' type=number step=0.01></div><div class=row><input id=stock placeholder='Voorraad *' type=number value=1><button class=btn-add onclick=add()>✅ Toevoegen</button></div></div><div class=card><h2>📦 Producten (<span id=cnt>0</span>)</h2><table><thead><tr><th>ID</th><th>Naam</th><th>Prijs</th><th>Voorraad</th><th>Acties</th></tr></thead><tbody id=tbl></tbody></table></div></div><script>async function load(){let r=await fetch('/api/products');let d=await r.json();document.getElementById('cnt').textContent=d.length;document.getElementById('tbl').innerHTML=d.map(x=>'<tr><td>'+x.id+'</td><td>'+x.nl+'</td><td>€'+x.price+'</td><td>'+x.stock+'</td><td><button class=btn-edit onclick=edit('+x.id+')>✏️</button><button class=btn-del onclick=del('+x.id+')>🗑</button></td></tr>').join('')}async function add(){let d={nl:document.getElementById('nl').value,en:document.getElementById('en').value,brand:document.getElementById('brand').value,price:document.getElementById('price').value,stock:document.getElementById('stock').value};await fetch('/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});load()}async function edit(id){let r=await fetch('/api/products');let d=await r.json();let p=d.find(x=>x.id===id);let pr=prompt('Prijs:',p.price);let st=prompt('Voorraad:',p.stock);if(pr)await fetch('/api/products/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({price:parseFloat(pr),stock:parseInt(st)})});load()}async function del(id){if(confirm('Verwijderen?')){await fetch('/api/products/'+id,{method:'DELETE'});load()}}load();</script></body></html>"));

app.listen(3000, () => console.log("✅ ARGOS: http://localhost:3000 | ⚙️ Admin: http://localhost:3000/admin"));