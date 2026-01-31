import { Request, Response } from "express";

export const getAllCards = (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello from the AllCards endpoint" });
};

export const getCard = (req: Request, res: Response) => {
  const { cardId, sizeId } = req.params;
  res.status(200).json({
    message: `Hello from the Card endpoint for cardId: ${cardId}${sizeId ? " and sizeId: " + sizeId : ""}`,
  });
};
