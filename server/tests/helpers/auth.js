const request = require("supertest");
const app = require("../../app");

// A counter paired with a timestamp makes each account unique, so one
// test's data never collides with another's in the shared test database.
let counter = 0;

// makeLoggedInUser: creates a fresh test account (which automatically
// logs it in) and returns the still-logged-in pretend browser plus the
// new user and the plain-text password (in case a caller wants to log
// in again as that user).
async function makeLoggedInUser(tempUser = {}) {
  counter += 1;
  const suffix = `${Date.now()}-${counter}`;

  // Callers can supply any of the temp user's credentials; omitted
  // ones fall back to unique defaults.
  const email = tempUser.email ?? `test-${suffix}@example.com`;
  const username = tempUser.username ?? `testuser-${suffix}`;
  const password = tempUser.password ?? "password123";

  // A fresh agent is the pretend browser: it keeps the session cookie
  // across requests, so the account stays "logged in" for the caller.
  const agent = request.agent(app);

  // Signing up returns the created user (without the password field).
  const response = await agent
    .post("/api/auth/signup")
    .send({ email, username, password });

  return {
    agent, // pretend browser, already logged in
    user: response.body.user, // created user (no password in it)
    password, // plain-text, for callers that need to re-login
  };
}

module.exports = { makeLoggedInUser };