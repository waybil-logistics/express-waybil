const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// EXACT connection string for your database
const MONGODB_URI = 'mongodb+srv://niceedee812_db_user:gfNoZpyQBvGOgH0W@cluster0.ubr3f1f.mongodb.net/express_waybil?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// Simple schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  customerName: String,
  origin: String,
  destination: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
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

app.get('/simple-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'simple-dashboard.html'));
});

// API: Get all shipments
app.get('/api/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.json(shipments);
  } catch (err) {
    res.json([]);
  }
});

// API: Track single shipment
app.get('/api/track/:number', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.number });
    if (shipment) {
      res.json(shipment);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
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

// API: Update status
app.put('/api/shipments/:number', async (req, res) => {
  try {
    const updated = await Shipment.findOneAndUpdate(
      { trackingNumber: req.params.number },
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Delete shipment
app.delete('/api/shipments/:number', async (req, res) => {
  try {
    await Shipment.deleteOne({ trackingNumber: req.params.number });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
