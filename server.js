const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://niceedee812_db_user:gfNoZpyQBvGOgH0W@cluster0.ubr3f1f.mongodb.net/express_waybil?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: String,
  customerName: String,
  customerPhone: String,
  origin: { city: String, country: String },
  destination: { city: String, country: String },
  weight: String,
  status: String,
  estimatedDelivery: Date,
  history: Array
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// API: Get all shipments
app.get('/api/shipments', async (req, res) => {
  const shipments = await Shipment.find();
  res.json(shipments);
});

// API: Get single shipment
app.get('/api/track/:number', async (req, res) => {
  const shipment = await Shipment.findOne({ trackingNumber: req.params.number });
  shipment ? res.json(shipment) : res.status(404).json({ error: 'Not found' });
});

// API: Add shipment
app.post('/api/shipments', async (req, res) => {
  const newShipment = new Shipment(req.body);
  await newShipment.save();
  res.json(newShipment);
});

// API: Update status
app.put('/api/shipments/:number', async (req, res) => {
  const updated = await Shipment.findOneAndUpdate(
    { trackingNumber: req.params.number },
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

// API: Delete shipment
app.delete('/api/shipments/:number', async (req, res) => {
  await Shipment.deleteOne({ trackingNumber: req.params.number });
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
