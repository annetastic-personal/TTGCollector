require("dotenv").config();
const sequelize = require("./config/connection");
const app = require("./app");

const PORT = process.env.PORT || 3001;

// Sync database and start server
sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
