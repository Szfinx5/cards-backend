import request from "supertest";
import { app } from "../server";

// test("returns matching card title", async () => {
//   const response = await request(app).get("/cards/card001");

//   expect(response.status).toBe(200);
//   expect(response.body).toEqual(
//     expect.objectContaining({
//       title: "card 1 title",
//     }),
//   );
// });

describe("Cards API Framework", () => {
  it("should return a health check response", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("should return hello from GET /cards", async () => {
    const res = await request(app).get("/api/cards");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Hello from the AllCards endpoint");
  });

  it("should return hello from GET /cards/:cardId", async () => {
    const res = await request(app).get("/api/cards/card001");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      "Hello from the Card endpoint for cardId: card001",
    );
  });

  it("should return hello from GET /cards/:cardId/:sizeId", async () => {
    const res = await request(app).get("/api/cards/card001/gt");
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual(
      "Hello from the Card endpoint for cardId: card001 and sizeId: gt",
    );
  });
});
