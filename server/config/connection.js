const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

let sequelize;

if (process.env.NODE_ENV === "test") {
  // Tests use a throwaway database so they never touch real data.
  sequelize = new Sequelize(
    "ttgcollector_TEST",
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
    },
  );
} else if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
    },
  );
}

module.exports = sequelize;
