const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config({ path: path.join(__dirname, "..", ".env"), quiet: true });

let sequelize;

if (process.env.NODE_ENV === "test") {
  // Tests use a throwaway database so they never touch real data.
  sequelize = new Sequelize(
    "ttgcollector_test",
    process.env.PG_ADMIN_USER,
    process.env.PG_ADMIN_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
      logging: false, //silence SQL query logging in tests
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
