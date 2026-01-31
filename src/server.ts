import express, { Request, Response } from "express";
import cardRoutes from "./routes/cardsRoute";

export const app = express();

app.use(express.json());

app.set("json spaces", 2);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Cards API");
});

// Cards routes
app.use("/api/cards", cardRoutes);

// Health check for AWS Elastic Beanstalk
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});
