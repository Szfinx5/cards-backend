import { Request, Response } from "express";
import {
  fetchCardsData,
  fetchSizeData,
  fetchTemplateData,
} from "../services/api";
import { buildCardDetail, transformToCardsList } from "../services/utils";

// Return every cards
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const [cardsData, templateData] = await Promise.all([
      fetchCardsData(),
      fetchTemplateData(),
    ]);

    const cards = transformToCardsList(cardsData, templateData);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
};

// Return a specific card by ID and optional size (or 'md', if not specified)
export const getCard = async (req: Request, res: Response) => {
  const { cardId, sizeId } = req.params;

  try {
    const [cardsData, templateData, sizeData] = await Promise.all([
      fetchCardsData(),
      fetchTemplateData(),
      fetchSizeData(),
    ]);

    const card = cardsData.find((c) => c.id === cardId);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }

    const cardResult = buildCardDetail({
      card: card,
      templates: templateData,
      sizes: sizeData,
      sizeId,
    });

    // If no available sizes available, return 404
    if (cardResult.availableSizes.length === 0) {
      res.status(404).json({ error: "Card is not available in any size" });
      return;
    }

    res.status(200).json(cardResult);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch card data" });
  }
};
