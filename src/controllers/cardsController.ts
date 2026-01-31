import { Request, Response } from "express";
import { fetchCardsData, fetchTemplateData } from "../services/api";
import { transformToCardsList } from "../services/utils";

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const [cardsData, templateData] = await Promise.all([
      fetchCardsData(),
      fetchTemplateData(),
    ]);

    const cards = transformToCardsList(cardsData, templateData);
    console.log("Cards fetched:", cards);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
};

export const getCard = async (req: Request, res: Response) => {
  const { cardId, sizeId } = req.params;
  res.status(200).json({
    message: `Hello from the Card endpoint for cardId: ${cardId}${sizeId ? " and sizeId: " + sizeId : ""}`,
  });
};
