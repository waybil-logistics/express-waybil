const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin pages
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Tracking data
const shipments = {
    "EXW12345": {
        status: "delivered",
        trackingNumber: "EXW12345",
        customerName: "John Smith",
        customerPhone: "+1 (555) 123-4567",
        origin: { city: "New York", country: "USA", code: "JFK" },
        destination: { city: "Los Angeles", country: "USA", code: "LAX" },
        weight: "15.5 kg",
        estimatedDelivery: "2026-06-15",
        actualDelivery: "2026-06-14",
        history: [
            { status: "pending", location: "New York, USA", timestamp: "2026-06-10 09:30 AM", description: "Shipment information received" },
            { status: "received", location: "JFK Airport Hub", timestamp: "2026-06-11 02:15 PM", description: "Package received" },
            { status: "in_transit", location: "In Transit", timestamp: "2026-06-12 08:00 AM", description: "Departed from facility" },
            { status: "delivered", location: "Los Angeles, USA", timestamp: "2026-06-14 03:45 PM", description: "Delivered to recipient" }
        ]
    },
    "EXW67890": {
        status: "in_transit",
        trackingNumber: "EXW67890",
        customerName: "Sarah Johnson",
        customerPhone: "+44 20 7946 0123",
        origin: { city: "London", country: "UK", code: "LHR" },
        destination: { city: "Dubai", country: "UAE", code: "DXB" },
        weight: "8.2 kg",
        estimatedDelivery: "2026-06-20",
        actualDelivery: null,
        history: [
            { status: "pending", location: "London, UK", timestamp: "2026-06-12 11:00 AM", description: "Shipment information received" },
            { status: "received", location: "London Hub", timestamp: "2026-06-13 09:30 AM", description: "Package received" },
            { status: "in_transit", location: "In Transit", timestamp: "2026-06-14 07:00 AM", description: "Departed from London" }
        ]
    },
    "EXW99999": {
        status: "delivered",
        trackingNumber: "EXW99999",
        customerName: "Yuki Tanaka",
        customerPhone: "+81 3-1234-5678",
        origin: { city: "Tokyo", country: "Japan", code: "HND" },
        destination: { city: "Osaka", country: "Japan", code: "KIX" },
        weight: "12.3 kg",
        estimatedDelivery: "2026-06-10",
        actualDelivery: "2026-06-09",
        history: [
            { status: "pending", location: "Tokyo, Japan", timestamp: "2026-06-05 10:00 AM", description: "Shipment information received" },
            { status: "received", location: "Tokyo Hub", timestamp: "2026-06-06 02:00 PM", description: "Package received" },
            { status: "in_transit", location: "In Transit", timestamp: "2026-06-07 08:00 AM", description: "Departed from Tokyo" },
            { status: "delivered", location: "Osaka, Japan", timestamp: "2026-06-09 04:30 PM", description: "Delivered to recipient" }
        ]
    },
    "EXW77777": {
        status: "in_transit",
        trackingNumber: "EXW77777",
        customerName: "Emma Wilson",
        customerPhone: "+61 2 9876 5432",
        origin: { city: "Sydney", country: "Australia", code: "SYD" },
        destination: { city: "Melbourne", country: "Australia", code: "MEL" },
        weight: "25.7 kg",
        estimatedDelivery: "2026-06-22",
        actualDelivery: null,
        history: [
            { status: "pending", location: "Sydney, Australia", timestamp: "2026-06-14 09:00 AM", description: "Shipment information received" },
            { status: "received", location: "Sydney Hub", timestamp: "2026-06-15 01:00 PM", description: "Package received" },
            { status: "in_transit", location: "In Transit", timestamp: "2026-06-16 06:00 AM", description: "Departed from Sydney" }
        ]
    },
    "EXW55555": {
        status: "pending",
        trackingNumber: "EXW55555",
        customerName: "Jean Dupont",
        customerPhone: "+33 1 23 45 67 89",
        origin: { city: "Paris", country: "France", code: "CDG" },
        destination: { city: "Lyon", country: "France", code: "LYS" },
        weight: "5.2 kg",
        estimatedDelivery: "2026-06-25",
        actualDelivery: null,
        history: [
            { status: "pending", location: "Paris, France", timestamp: "2026-06-15 11:00 AM", description: "Shipment information received" }
        ]
    }
};

// API route for tracking
app.get('/api/track/:number', (req, res) => {
    const trackingNumber = req.params.number.toUpperCase();
    const shipment = shipments[trackingNumber];
    
    if (shipment) {
        res.json(shipment);
    } else {
        res.status(404).json({ error: "Shipment not found" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
