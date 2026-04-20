const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB connection (replace with your URI)
mongoose.connect("mongodb+srv://Vighnesh:Blade@2004@cluster0.uqi1sas.mongodb.net/?appName=Cluster0", {
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

// 📡 API to receive data from ESP32
app.post("/api/energy", async (req, res) => {
    try {
        const data = new Energy(req.body);
        await data.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📊 API to fetch latest data
app.get("/api/energy", async (req, res) => {
    const data = await Energy.find().sort({ createdAt: -1 }).limit(20);
    res.json(data);
});

// 🌐 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));