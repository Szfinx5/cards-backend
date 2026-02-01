import { Request, Response } from "express";
import {
  fetchCardsData,
  fetchSizeData,
  fetchTemplateData,
} from "../services/api";
import { buildCardDetail, transformToCardsList } from "../services/utils";
import type { Card, Size, Template } from "../types";

// Return every cards
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const results = await Promise.allSettled([
      fetchCardsData(),
      fetchTemplateData(),
    ]);

    const errors = [];
    if (results[0].status === "rejected") {
      errors.push("Failed to fetch cards data");
    }
    if (results[1].status === "rejected") {
      errors.push("Failed to fetch template data");
    }
    if (errors.length > 0) {
      res.status(500).json({ error: errors.join("; ") });
      return;
    }

    const cardsData = (results[0] as PromiseFulfilledResult<Card[]>).value;
    const templateData = (results[1] as PromiseFulfilledResult<Template[]>)
      .value;

    const cards = transformToCardsList(cardsData, templateData);
    res.status(200).json(cards);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unexpected error occurred while fetching cards" });
  }
};

// Return a specific card by ID and optional size (or 'md', if not specified)
export const getCard = async (req: Request, res: Response) => {
  const { cardId, sizeId } = req.params;

  try {
    const results = await Promise.allSettled([
      fetchCardsData(),
      fetchTemplateData(),
      fetchSizeData(),
    ]);

    const errors = [];
    if (results[0].status === "rejected") {
      errors.push("Failed to fetch cards data");
    }
    if (results[1].status === "rejected") {
      errors.push("Failed to fetch template data");
    }
    if (results[2].status === "rejected") {
      errors.push("Failed to fetch size data");
    }
    if (errors.length > 0) {
      res.status(500).json({ error: errors.join("; ") });
      return;
    }

    const cardsData = (results[0] as PromiseFulfilledResult<Card[]>).value;
    const templateData = (results[1] as PromiseFulfilledResult<Template[]>)
      .value;
    const sizeData = (results[2] as PromiseFulfilledResult<Size[]>).value;

    const card = cardsData.find((c: Card) => c.id === cardId);
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
    res
      .status(500)
      .json({ error: "Unexpected error occurred while fetching card data" });
  }
};
