const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// YOUR actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://niceedee812_db_user:gfNoZpyQBvGOgH0W@cluster0.ubr3f1f.mongodb.net/express_waybil?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  customerName: String,
  customerPhone: String,
  origin: {
    city: String,
    country: String,
    code: String
  },
  destination: {
    city: String,
    country: String,
    code: String
  },
  weight: String,
  status: { type: String, default: 'pending' },
  estimatedDelivery: Date,
  actualDelivery: Date,
  history: [{
    status: String,
    location: String,
    timestamp: String,
    description: String
  }]
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

// API: Get shipment by tracking number
app.get('/api/track/:number', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.number.toUpperCase() });
    if (shipment) {
      res.json(shipment);
    } else {
      res.status(404).json({ error: 'Shipment not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all shipments
app.get('/api/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Add new shipment
app.post('/api/shipments', async (req, res) => {
  try {
    const newShipment = new Shipment(req.body);
    await newShipment.save();
    res.json({ success: true, shipment: newShipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Update shipment status
app.put('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    const updated = await Shipment.findOneAndUpdate(
      { trackingNumber: req.params.trackingNumber.toUpperCase() },
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Delete shipment
app.delete('/api/shipments/:trackingNumber', async (req, res) => {
  try {
    await Shipment.deleteOne({ trackingNumber: req.params.trackingNumber.toUpperCase() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
