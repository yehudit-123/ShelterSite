const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", require("./routs/UserRouts"));
app.use("/messages", require("./routs/MessagesRoute"));
app.use("/shelters", require("./routs/ShelterRoute"));
app.use("/reviews", require("./routs/ReviewsRoute"));
app.use("/likes", require("./routs/LikesRoute"));
app.get("/", (req, res) => {
  return res.status(200).json("server is running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});