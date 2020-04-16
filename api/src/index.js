const express = require("express");
const cors = require("cors");
const cronjob = require("./cron").cronjob;
const statisticsRoutes = require("./routes/statisticsRoutes");
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use("/", statisticsRoutes);

cronjob();

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
