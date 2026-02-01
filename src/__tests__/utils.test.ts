import { transformToCardsList, buildCardDetail } from "../services/utils";
import mockData from "./mockData.json";

describe("transformToCardsList unit tests", () => {
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
      {
        imageUrl: "/back-cover-portrait.jpg",
        title: "test card 3 title",
        url: "/cards/card003",
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

describe("buildCardDetail unit tests", () => {
  it("should build card detail with correct size and price", () => {
    const card = mockData.cards[0];
    const templates = mockData.templates;
    const sizes = mockData.sizes;

    const result = buildCardDetail({
      card,
      templates,
      sizes,
      sizeId: "gt",
    });

    expect(result).toEqual({
      title: "test card 1 title",
      size: "gt",
      availableSizes: [
        { id: "sm", title: "Small_test" },
        { id: "gt", title: "Giant_test" },
      ],
      imageUrl: "/back-cover-portrait.jpg",
      price: "£2.00",
      pages: [
        {
          title: "Front Cover",
          width: 300,
          height: 600,
          imageUrl: "/back-cover-portrait.jpg",
        },
      ],
    });
  });

  it("should default to 'md' size if sizeId is not provided or invalid", () => {
    const card = mockData.cards[0];
    const templates = mockData.templates;
    const sizes = mockData.sizes;

    const resultNoSizeId = buildCardDetail({
      card,
      templates,
      sizes,
    });

    expect(resultNoSizeId.size).toBe("md");
    expect(resultNoSizeId.price).toBe("£1.00");

    const resultInvalidSizeId = buildCardDetail({
      card,
      templates,
      sizes,
      sizeId: "invalid",
    });

    expect(resultInvalidSizeId.size).toBe("md");
    expect(resultInvalidSizeId.price).toBe("£1.00");
  });

  it("should return empty availableSizes if card is not available in any size", () => {
    const card = {
      id: "card5",
      title: "Card 5",
      sizes: [],
      basePrice: 100,
      pages: [{ title: "Front", templateId: "template1" }],
    };

    const templates = mockData.templates;
    const sizes = mockData.sizes;

    const result = buildCardDetail({
      card,
      templates,
      sizes,
      sizeId: "md",
    });

    expect(result.availableSizes).toEqual([]);
  });

  it("should return empty string for imageUrl if the card has no pages", () => {
    const cardWithNoPages = {
      id: "card-empty",
      title: "Empty Card",
      sizes: ["md"],
      basePrice: 100,
      pages: [],
    };

    const result = buildCardDetail({
      card: cardWithNoPages,
      templates: mockData.templates,
      sizes: mockData.sizes,
      sizeId: "md",
    });

    expect(result.imageUrl).toBe("");
    expect(result.pages).toEqual([]);
  });

  it("should use priceMultiplier=1 if not present in size", () => {
    const sizesNoMultiplier = [{ id: "md", title: "Medium" }];
    const card = {
      id: "card7",
      title: "Card 7",
      sizes: ["md"],
      basePrice: 100,
      pages: [{ title: "Front", templateId: "template1" }],
    };

    const templates = mockData.templates;

    const result = buildCardDetail({
      card,
      templates,
      sizes: sizesNoMultiplier as any,
      sizeId: "md",
    });

    expect(result.price).toBe("£1.00");
  });
});
