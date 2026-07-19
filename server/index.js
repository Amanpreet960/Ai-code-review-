import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import reviewRouter from './routes/reviewRoutes.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Review API
app.use('/review', reviewRouter);

// Error handler
app.use((err, _, res, __) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Unexpected server error.',
  });
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Review API listening on port ${PORT}`);
});
