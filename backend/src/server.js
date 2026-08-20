import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./db/schema.js";
import  ingestRoutes  from "./routes/ingest.routes.js";
import  { errorHandler }  from "./middleware/error-handler.js";
import  itemRoutes  from "./routes/item.routes.js";
import queryRoutes from "./routes/query.routes.js";
import pinoHttp from "pino-http";
import logger from "./config/logger.js";

dotenv.config();

initializeDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  pinoHttp({
    logger
  })
);

app.use(ingestRoutes);
app.use(itemRoutes);
app.use(queryRoutes);

app.use(errorHandler);


app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ai-knowledge-inbox"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});