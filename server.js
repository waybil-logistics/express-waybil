const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.static('public'));

app.get('/api/track/:number', (req, res) => {
    const trackingNumber = req.params.number;
    
    const shipments = {
        "EXW12345": {
            status: "delivered",
            trackingNumber: "EXW12345",
            customerName: "John Smith",
            origin: { city: "New York", country: "USA" },
            destination: { city: "Los Angeles", country: "USA" },
            estimatedDelivery: "2026-06-15",
            history: [
                { status: "pending", location: "New York", timestamp: "2026-06-10" },
                { status: "received", location: "NYC Hub", timestamp: "2026-06-11" },
                { status: "in_transit", location: "In Transit", timestamp: "2026-06-12" },
                { status: "delivered", location: "Los Angeles", timestamp: "2026-06-14" }
            ]
        },
        "EXW67890": {
            status: "in_transit",
            trackingNumber: "EXW67890",
            customerName: "Sarah Johnson",
            origin: { city: "London", country: "UK" },
            destination: { city: "Dubai", country: "UAE" },
            estimatedDelivery: "2026-06-20",
            history: [
                { status: "pending", location: "London", timestamp: "2026-06-12" },
                { status: "received", location: "London Hub", timestamp: "2026-06-13" },
                { status: "in_transit", location: "In Transit", timestamp: "2026-06-14" }
            ]
        },
        "EXW99999": {
            status: "delivered",
            trackingNumber: "EXW99999",
            customerName: "Yuki Tanaka",
            origin: { city: "Tokyo", country: "Japan" },
            destination: { city: "Osaka", country: "Japan" },
            estimatedDelivery: "2026-06-10",
            history: [
                { status: "pending", location: "Tokyo", timestamp: "2026-06-05" },
                { status: "received", location: "Tokyo Hub", timestamp: "2026-06-06" },
                { status: "in_transit", location: "In Transit", timestamp: "2026-06-07" },
                { status: "delivered", location: "Osaka", timestamp: "2026-06-09" }
            ]
        },
        "EXW77777": {
            status: "in_transit",
            trackingNumber: "EXW77777",
            customerName: "Emma Wilson",
            origin: { city: "Sydney", country: "Australia" },
            destination: { city: "Melbourne", country: "Australia" },
            estimatedDelivery: "2026-06-22",
            history: [
                { status: "pending", location: "Sydney", timestamp: "2026-06-14" },
                { status: "received", location: "Sydney Hub", timestamp: "2026-06-15" },
                { status: "in_transit", location: "In Transit", timestamp: "2026-06-16" }
            ]
        },
        "EXW55555": {
            status: "pending",
            trackingNumber: "EXW55555",
            customerName: "Jean Dupont",
            origin: { city: "Paris", country: "France" },
            destination: { city: "Lyon", country: "France" },
            estimatedDelivery: "2026-06-25",
            history: [
                { status: "pending", location: "Paris", timestamp: "2026-06-15" }
            ]
        }
    };
    
    if (shipments[trackingNumber]) {
        res.json(shipments[trackingNumber]);
    } else {
        res.status(404).json({ error: "Shipment not found" });
    }
});

app.listen(PORT, () => {
    console.log("Server running on http://localhost:5000");
});