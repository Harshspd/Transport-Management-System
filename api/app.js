import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import cron from "node-cron";
import clientRouter from "./routes/clientRouter.js";
import commonRouter from "./routes/commonRouter.js";
import itemRouter from "./routes/itemRouter.js";
import estimateRouter from "./routes/estimateRouter.js";
import settingRouter from "./routes/settingRouter.js";
import authRouter from "./routes/authRoutes.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import industryRouter from "./routes/industryRouter.js";
import createUploadDir from "./helpers/utililty.js";
import connection from "./config/db.js";
import dashboard from "./routes/dashboard.js";
import purchase from "./routes/purchaseRouter.js";
import inventory from "./routes/inventoryRouter.js";
import processInvoices from "./cron/overdueReminder.mjs";
import { initializeWebSocket } from "./socket.js";
import authRoutes from './routes/authRoutes.js';
import consignerRoutes from './routes/consignerRoutes.js';
import consigneeRoutes from './routes/consigneeRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Create an HTTP server to attach WebSocket
const server = http.createServer(app);

// Connect to MongoDB
await connection();

// __dirname
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
createUploadDir();

// Use middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/clients", clientRouter);
app.use("/api/countries", commonRouter);
app.use("/api/items", itemRouter);
app.use("/api/estimates", estimateRouter);
app.use("/api/settings", settingRouter);
app.use("/api/auth", authRouter);
app.use("/api/files", commonRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/dashboard", dashboard);
app.use("/api/purchase", purchase);
app.use("/api/inventory", inventory);
app.use("/api/industry",industryRouter);
app.use('/api/auth', authRoutes);
app.use('/api/consigners', consignerRoutes);
app.use('/api/consignees', consigneeRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/user', userRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Initialize WebSocket
initializeWebSocket(server);


// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Cron job
cron.schedule("0 15 * * * *", () => {
  console.log("Cron job triggered at", new Date());
  processInvoices();
});
