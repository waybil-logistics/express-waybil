const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/simple-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simple-dashboard.html'));
});

// Sample shipments data
const shipments = {
  "EXW12345": { 
    trackingNumber: "EXW12345", 
    customerName: "John Smith", 
    origin: { city: "New York" }, 
    destination: { city: "Los Angeles" }, 
    status: "delivered" 
  },
  "EXW67890": { 
    trackingNumber: "EXW67890", 
    customerName: "Sarah Johnson", 
    origin: { city: "London" }, 
    destination: { city: "Dubai" }, 
    status: "in_transit" 
  },
  "EXW99999": { 
    trackingNumber: "EXW99999", 
    customerName: "Yuki Tanaka", 
    origin: { city: "Tokyo" }, 
    destination: { city: "Osaka" }, 
    status: "delivered" 
  }
};

app.get('/api/track/:number', (req, res) => {
  const shipment = shipments[req.params.number];
  if (shipment) {
    res.json(shipment);
  } else {
    res.status(404).json({ error: "Shipment not found" });
  }
});

app.get('/api/shipments', (req, res) => {
  res.json(Object.values(shipments));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
