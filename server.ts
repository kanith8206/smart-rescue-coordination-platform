import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import { Incident } from "./src/models/Incident.js";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Rescue Platform API is running" });
  });

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-rescue';
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Main Server connected to MongoDB');
    
    // Seed data if empty
    const count = await Incident.countDocuments();
    if (count === 0) {
      const mockIncidents = [
        { id: 1, type: "flood", lat: 23.8103, lng: 90.4125, severity: "high", status: "pending", reporter: "Citizen A", description: "Water level rising rapidly in Sector 4." },
        { id: 2, type: "earthquake", lat: 23.7949, lng: 90.4043, severity: "critical", status: "active", reporter: "Citizen B", description: "Building collapse near main road." },
        { id: 3, type: "fire", lat: 23.8200, lng: 90.4200, severity: "high", status: "pending", reporter: "Citizen C", description: "Industrial fire reported in Zone B." },
        { id: 4, type: "landslide", lat: 23.7500, lng: 90.3800, severity: "moderate", status: "resolved", reporter: "Citizen D", description: "Minor landslide blocking secondary road." },
        { id: 5, type: "flood", lat: 23.8500, lng: 90.4500, severity: "critical", status: "pending", reporter: "Citizen E", description: "Embankment breach near riverside." },
      ];
      await Incident.insertMany(mockIncidents);
      console.log('Seeded initial mock incidents');
    }
  } catch(err) {
    console.error('MongoDB connection error:', err);
  }

  app.get("/api/incidents", async (req, res) => {
    try {
      const incidents = await Incident.find().sort({ createdAt: -1 });
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const newIncident = new Incident({ ...req.body, status: "pending" });
      await newIncident.save();
      io.emit("new_incident", newIncident);
      res.status(201).json(newIncident);
    } catch (error) {
      res.status(400).json({ error: "Failed to create incident" });
    }
  });

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sos_signal", (data) => {
      console.log("SOS Signal received:", data);
      // Broadcast to all rescue teams and admin
      io.emit("sos_alert", { ...data, timestamp: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
