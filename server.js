const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend dashboard
app.use(express.static(path.join(__dirname)));

// 🔗 MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vighnesh:Blade%402004@cluster0.uqi1sas.mongodb.net/?appName=Cluster0";
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 📦 Schema
const energySchema = new mongoose.Schema({
    occupied: Boolean,
    totalWh: Number,
    powerNow: Number,
    cost: Number,
    timestamp: Number,
    applianceCount: Number,
    autoMode: Boolean,
    appliances: Array,
    logs: Array,
    createdAt: { type: Date, default: Date.now }
});

const Energy = mongoose.model("Energy", energySchema);

// 📡 POST - Store data from ESP32
app.post("/api/energy", async (req, res) => {
    try {
        const data = new Energy(req.body);
        await data.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📊 GET - Fetch latest data for dashboard
app.get("/api/energy", async (req, res) => {
    const data = await Energy.find().sort({ createdAt: -1 }).limit(50);
    res.json(data);
});

// Serve index.html for root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🌐 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
