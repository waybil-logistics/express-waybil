const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// Your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://niceedee812_db_user:gfNoZpyQBvGOgH0W@cluster0.ubr3f1f.mongodb.net/express_waybil?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    createDefaultShipments();
  })
  .catch(err => console.error('❌ MongoDB error:', err));

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  trackingNumber: { type: String, required: true, unique: true },
  customerName: String,
  customerPhone: String,
  origin: { city: String, country: String, code: String },
  destination: { city: String, country: String, code: String },
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

// Create default shipments if database is empty
async function createDefaultShipments() {
  const count = await Shipment.countDocuments();
  if (count === 0) {
    const defaultShipments = [
      {
        trackingNumber: "EXW12345",
        customerName: "John Smith",
        customerPhone: "+1 (555) 123-4567",
        origin: { city: "New York", country: "USA", code: "JFK" },
        destination: { city: "Los Angeles", country: "USA", code: "LAX" },
        weight: "15.5 kg",
        status: "delivered",
        history: [{ status: "pending", location: "New York", timestamp: "2026-06-10", description: "Created" }]
      },
      {
        trackingNumber: "EXW67890",
        customerName: "Sarah Johnson",
        customerPhone: "+44 20 7946 0123",
        origin: { city: "London", country: "UK", code: "LHR" },
        destination: { city: "Dubai", country: "UAE", code: "DXB" },
        weight: "8.2 kg",
        status: "in_transit",
        history: [{ status: "pending", location: "London", timestamp: "2026-06-12", description: "Created" }]
      },
      {
        trackingNumber: "EXW99999",
        customerName: "Yuki Tanaka",
        customerPhone: "+81 3-1234-5678",
        origin: { city: "Tokyo", country: "Japan", code: "HND" },
        destination: { city: "Osaka", country: "Japan", code: "KIX" },
        weight: "12.3 kg",
        status: "delivered",
        history: [{ status: "pending", location: "Tokyo", timestamp: "2026-06-05", description: "Created" }]
      },
      {
        trackingNumber: "EXW77777",
        customerName: "Emma Wilson",
        customerPhone: "+61 2 9876 5432",
        origin: { city: "Sydney", country: "Australia", code: "SYD" },
        destination: { city: "Melbourne", country: "Australia", code: "MEL" },
        weight: "25.7 kg",
        status: "in_transit",
        history: [{ status: "pending", location: "Sydney", timestamp: "2026-06-14", description: "Created" }]
      },
      {
        trackingNumber: "EXW55555",
        customerName: "Jean Dupont",
        customerPhone: "+33 1 23 45 67 89",
        origin: { city: "Paris", country: "France", code: "CDG" },
        destination: { city: "Lyon", country: "France", code: "LYS" },
        weight: "5.2 kg",
        status: "pending",
        history: [{ status: "pending", location: "Paris", timestamp: "2026-06-15", description: "Created" }]
      }
    ];
    
    await Shipment.insertMany(defaultShipments);
    console.log('✅ Default shipments created');
  }
}

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
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Add new shipment
app.post('/api/shipments', async (req, res) => {
  try {
    const existing = await Shipment.findOne({ trackingNumber: req.body.trackingNumber });
    if (existing) {
      return res.status(400).json({ error: 'Tracking number already exists' });
    }
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
