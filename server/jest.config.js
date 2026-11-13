process.env.NODE_ENV = "test";

module.exports = {
  testEnvironment: "node",
  verbose: true,
  globalSetup: "./tests/global-setup.js",
  globalTeardown: "./tests/global-teardown.js",
};

