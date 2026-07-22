import './env.js';   // ⚠️ yeh sabse pehla import hona chahiye

import express from 'express';
import cors from 'cors';
import reviewRouter from './routes/reviewRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Review API is running'
  });
});

// Review API
app.use('/review', reviewRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Unexpected server error.',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Review API listening on port ${PORT}`);
});

// Server error handling
server.on('error', (error) => {
  console.error("Server failed to start:", error);
});

process.on('uncaughtException', (error) => {
  console.error("Uncaught Error:", error);
});

process.on('unhandledRejection', (error) => {
  console.error("Unhandled Promise Error:", error);
});
