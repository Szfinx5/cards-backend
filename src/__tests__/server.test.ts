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
  afterEach(() => {
    jest.restoreAllMocks();
  });

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

    it("should handle errors if fails to fetch cards data", async () => {
      // Mock the fetchCardsData, fetchTemplateData, and fetchSizeData to throw errors
      const { fetchCardsData, fetchTemplateData } = require("../services/api");
      fetchCardsData.mockRejectedValueOnce(
        new Error("Failed to fetch cards data"),
      );
      fetchTemplateData.mockRejectedValueOnce(
        new Error("Failed to fetch template data"),
      );

      const res = await request(app).get("/cards");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: "Failed to fetch cards data; Failed to fetch template data",
      });
    });

    it("should handle unexpected errors in GET /cards (catch block)", async () => {
      // Mocking an error in transformToCardsList function
      jest
        .spyOn(require("../services/utils"), "transformToCardsList")
        .mockImplementation(() => {
          throw new Error("Unexpected error in transformToCardsList");
        });

      const res = await request(app).get("/cards");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: "Unexpected error occurred while fetching cards",
      });
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

    it("should handle errors if fails to fetch cards data", async () => {
      // Mock the fetchCardsData, fetchTemplateData, and fetchSizeData to throw errors
      const {
        fetchCardsData,
        fetchTemplateData,
        fetchSizeData,
      } = require("../services/api");
      fetchCardsData.mockRejectedValueOnce(
        new Error("Failed to fetch cards data"),
      );
      fetchTemplateData.mockRejectedValueOnce(
        new Error("Failed to fetch template data"),
      );
      fetchSizeData.mockRejectedValueOnce(
        new Error("Failed to fetch size data"),
      );

      const res = await request(app).get("/cards/card001/gt");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error:
          "Failed to fetch cards data; Failed to fetch template data; Failed to fetch size data",
      });
    });

    it("should handle unexpected errors in GET /cards/:cardId/:sizeId? (catch block)", async () => {
      // Mocking an error in buildCardDetail function
      jest
        .spyOn(require("../services/utils"), "buildCardDetail")
        .mockImplementation(() => {
          throw new Error("Unexpected error in buildCardDetail");
        });

      const res = await request(app).get("/cards/card001");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: "Unexpected error occurred while fetching card data",
      });
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
