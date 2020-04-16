const dbConfig = require("../config/defines");
const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(dbConfig.url, { useUnifiedTopology: true });

const summary = async (req, res) => {
  try {
    client.connect(function (err) {
      const db = client.db(dbConfig.name);

      db.collection(dbConfig.collection)
        .find()
        .toArray((err, results) => {
          if (err) throw err;
          results.forEach((value) => {
            var result = JSON.parse(JSON.stringify(value));
            res.json({
              total_confirmed: result.total_confirmed,
              total_deaths: result.total_deaths,
              total_recovered: result.total_recovered,
              last_date_updated: result.last_date_updated,
              country_statistics: result.country_statistics,
            });
          });
        });
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  summary,
};
