import { Router } from "express";
import { getAllCards, getCard } from "../controllers/cardsController";

const router = Router();

router.get("/", getAllCards);
router.get("/:cardId/:sizeId?", getCard);

export default router;
