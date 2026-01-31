import express, { Request, Response } from "express";
import { getAllCards, getCard } from "./controllers/cardsController";

export const app = express();

app.use(express.json());

app.set("json spaces", 2);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Cards API",
    usage: "Use the endpoints below to interact with the API.",
    routes: [
      { method: "GET", path: "/health", description: "Health check endpoint" },
      { method: "GET", path: "/cards", description: "Get all cards" },
      {
        method: "GET",
        path: "/cards/:cardId/:sizeId",
        description: "Get a card by cardId and sizeId (sizeId is optional)",
      },
    ],
  });
});

// Cards routes
app.get("/cards", getAllCards);
app.get("/cards/:cardId/:sizeId?", getCard);

// Health check for AWS Elastic Beanstalk
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});
