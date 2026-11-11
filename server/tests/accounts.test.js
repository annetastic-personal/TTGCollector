const request = require("supertest");
const app = require("../app");

describe("POST /api/auth/signup", () => {
  test("returns 201 with user email and username without password", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({email: "test@signup.test", username: "testsignup", password: "password123"});

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe("test@signup.test");
    expect(response.body.user.username).toBe("testsignup");
    expect(response.body.user.password).toBeUndefined();

  });
});
