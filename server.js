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

app.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Sample shipments
const shipments = {
  "EXW12345": { trackingNumber: "EXW12345", customerName: "John Smith", origin: { city: "New York" }, destination: { city: "Los Angeles" }, status: "delivered" },
  "EXW67890": { trackingNumber: "EXW67890", customerName: "Sarah Johnson", origin: { city: "London" }, destination: { city: "Dubai" }, status: "in_transit" },
  "EXW99999": { trackingNumber: "EXW99999", customerName: "Yuki Tanaka", origin: { city: "Tokyo" }, destination: { city: "Osaka" }, status: "delivered" },
  "EXW77777": { trackingNumber: "EXW77777", customerName: "Emma Wilson", origin: { city: "Sydney" }, destination: { city: "Melbourne" }, status: "in_transit" },
  "EXW55555": { trackingNumber: "EXW55555", customerName: "Jean Dupont", origin: { city: "Paris" }, destination: { city: "Lyon" }, status: "pending" }
};

app.get('/api/track/:number', (req, res) => {
  const shipment = shipments[req.params.number];
  shipment ? res.json(shipment) : res.status(404).json({ error: "Not found" });
});

app.get('/api/shipments', (req, res) => {
  res.json(Object.values(shipments));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
