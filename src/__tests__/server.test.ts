import request from "supertest";
import { app } from "../server";

jest.mock("../services/api", () => {
  const mockData = require("./mockData.json");
  return {
    fetchCardsData: jest.fn().mockResolvedValue(mockData.cards),
    fetchTemplateData: jest.fn().mockResolvedValue(mockData.templates),
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

  it("should return hello from GET /cards/:cardId", async () => {
    const res = await request(app).get("/cards/card001");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      "Hello from the Card endpoint for cardId: card001",
    );
  });

  it("should return hello from GET /cards/:cardId/:sizeId", async () => {
    const res = await request(app).get("/cards/card001/gt");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      "Hello from the Card endpoint for cardId: card001 and sizeId: gt",
    );
  });

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
