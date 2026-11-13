const request = require("supertest");
const app = require("../app");
const { makeLoggedInUser } = require("./helpers/auth");
const expectCookies = require("supertest/lib/cookies");

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
  test("returns 400 when required fields are missing", async () => {
    //sending only email, not username or password, to hit the route's missing field check
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ email: "missingfields.test" });
    
    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Email, username, and password are required");
    
  });
  test("returns 409 when email duplicates existing user", async () => {

    const { user: existingUser } = await makeLoggedInUser();
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        email: existingUser.email,
        username: `fresh-${Date.now()}`,
        password: "password123"
      });

    expect(response.status).toBe(409);

    expect(response.body.message).toBe(
      "Email or username already in use",
    );
  });
  test("returns 409 when username duplicates existing user", async () => {

    const { user: existingUser } = await makeLoggedInUser();
    const response = await request(app).post("/api/auth/signup").send({
      email: `fresh-${Date.now()}@fake.com`,
      username: existingUser.username,
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Email or username already in use");
  });
});

describe("POST /api/auth/login", () => {
  test("returns 200 with login by email", async () => {
    const existingAccount = await makeLoggedInUser();
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: existingAccount.user.email,
        password: existingAccount.password,
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged in successfully");
    expect(response.body.user.email).toBe(existingAccount.user.email);
    expect(response.body.user.username).toBe(existingAccount.user.username);
  });
  test("returns 200 with login by username", async () => {
    const existingAccount = await makeLoggedInUser();
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: existingAccount.user.username,
        password: existingAccount.password,
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged in successfully");
    expect(response.body.user.email).toBe(existingAccount.user.email);
    expect(response.body.user.username).toBe(existingAccount.user.username);
  });
  test("returns 401 with wrong password", async () => {
    const existingAccount = await makeLoggedInUser();
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: existingAccount.user.email,
        password: existingAccount.password + "x",
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

describe("POST /api/auth/logout", () => {
  test("returns 401 with 'Not authenticated' after logout", async () => {

    const { agent } = await makeLoggedInUser();
    const response = await agent.post("/api/auth/logout");
    const userResponse = await agent.get("/api/auth/user");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
    expect(userResponse.status).toBe(401);
    expect(userResponse.body.message).toBe("Not authenticated");
  });
});

describe("GET /api/auth/user", () => {
  test("returns 401 when not logged in", async () => {
    const response = await request(app).get("/api/auth/user");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authenticated");
  });

  test("returns 200 with user when logged in", async () => {
    const loggedIn = await makeLoggedInUser();

    const response = await loggedIn.agent.get("/api/auth/user");

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(loggedIn.user.email);
    expect(response.body.user.username).toBe(loggedIn.user.username);
  });
});