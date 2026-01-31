import { transformToCardsList } from "../services/utils";
import mockData from "./mockData.json";

describe("Card utils tests", () => {
  it("should transform cards and templates to cards list", () => {
    const cards = mockData.cards;
    const templates = mockData.templates;

    const result = transformToCardsList(cards, templates);
    expect(result).toEqual([
      {
        title: "test card 1 title",
        imageUrl: "/back-cover-portrait.jpg",
        url: "/cards/card001",
      },
      {
        title: "test card 2 title",
        imageUrl: "",
        url: "/cards/card002",
      },
    ]);
  });

  it("should return cards with empty imageUrl if templates array is empty", () => {
    const cards = mockData.cards;
    const result = transformToCardsList(cards, []);
    expect(result).toEqual(
      cards.map((card) => ({
        title: card.title,
        imageUrl: "",
        url: `/cards/${card.id}`,
      })),
    );
  });

  it("should return empty imageUrl if card has no pages", () => {
    const cards = [
      {
        id: "card004",
        title: "no pages",
        sizes: ["A5"],
        basePrice: 10,
        pages: [],
      },
    ];
    const templates = mockData.templates;
    const result = transformToCardsList(cards as any, templates);
    expect(result[0].imageUrl).toBe("");
  });
});
