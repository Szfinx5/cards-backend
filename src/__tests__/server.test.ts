import request from "supertest";
import { app } from "../server";

jest.mock("../services/api", () => {
  const mockData = require("./mockData.json");
  return {
    fetchCardsData: jest.fn().mockResolvedValue(mockData.cards),
    fetchTemplateData: jest.fn().mockResolvedValue(mockData.templates),
    fetchSizeData: jest.fn().mockResolvedValue(mockData.sizes),
  };
});

describe("Cards API Framework", () => {
  describe("GET /cards endpoints", () => {
    it("should return card list from GET /cards", async () => {
      const res = await request(app).get("/cards");
      expect(res.status).toBe(200);

      expect(res.body).toEqual([
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

    it("should handle errors in GET /cards", async () => {
      // Mock the fetchCardsData to throw an error
      const { fetchCardsData } = require("../services/api");
      fetchCardsData.mockRejectedValueOnce(new Error("Error fetching cards"));

      const res = await request(app).get("/cards");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to fetch cards" });
    });
  });

  describe("GET /cards/:cardId/:sizeId? endpoint", () => {
    it("should return the card details with default 'md' size", async () => {
      const res = await request(app).get("/cards/card001");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        title: "test card 1 title",
        size: "md",
        availableSizes: [
          {
            id: "sm",
            title: "Small_test",
          },
          {
            id: "gt",
            title: "Giant_test",
          },
        ],
        imageUrl: "/back-cover-portrait.jpg",
        price: "£1.00",
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

    it("should return the card details with specified 'gt' size", async () => {
      const res = await request(app).get("/cards/card001/gt");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        title: "test card 1 title",
        size: "gt",
        availableSizes: [
          {
            id: "sm",
            title: "Small_test",
          },
          {
            id: "gt",
            title: "Giant_test",
          },
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

    it("should return 404 for invalid cardId", async () => {
      const res = await request(app).get("/cards/invalidCardId/gt");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Card not found" });
    });

    it("should return 404 if card is not available in any size", async () => {
      const res = await request(app).get("/cards/card003/sm");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Card is not available in any size" });
    });

    it("should handle errors if fetchCardsData throws an error", async () => {
      // Mock the fetchCardsData to throw an error
      const { fetchCardsData } = require("../services/api");
      fetchCardsData.mockRejectedValueOnce(new Error("Error fetching cards"));

      const res = await request(app).get("/cards/card001/gt");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Failed to fetch card data" });
    });
  });

  describe("GET /health and default route", () => {
    it("should return a health check response", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
    });

    it("should return a welcome message", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.text).toContain("Welcome to the Cards API");
    });

    it("should return 404 for unknown route", async () => {
      const res = await request(app).get("/unknown/route");
      expect(res.status).toBe(404);
    });
  });
});
