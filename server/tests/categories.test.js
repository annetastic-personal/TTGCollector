const request = require("supertest");
const app = require("../app");

describe("GET /api/categories", () => {
  test("returns 200 with an array", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});