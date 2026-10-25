process.env.NODE_ENV = "test";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const { Client } = require("pg");

module.exports = async () => {
  // Connect to the default "postgres" database so we can create the test DB.
  // (You can't drop a database while connected to it, so we connect elsewhere.)
  const admin = new Client({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres",
  });
  await admin.connect();

  // Drop and recreate the test database so every run starts clean.
  await admin.query("DROP DATABASE IF EXISTS ttgcollector_TEST");
  await admin.query("CREATE DATABASE ttgcollector_TEST");
  await admin.end();

  // Build the app (this defines the models and the session table), then
  // create all tables fresh.
  require("../app");
  const sequelize = require("../config/connection");
  await sequelize.sync({ force: true });
  await sequelize.close();
};
