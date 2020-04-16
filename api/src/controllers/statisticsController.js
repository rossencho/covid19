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
            let result = JSON.parse(JSON.stringify(value));
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

const createItem = (stateData, key) => {
  let {
    name,
    address,
    latitude,
    longitude,
    confirmed,
    deaths,
    recovered,
  } = stateData;

  let total_cases =
    parseInt(confirmed) + parseInt(deaths) + parseInt(recovered);

  if (stateData.hasOwnProperty("code") && stateData.code === "US") {
    longitude = -98.35;
    latitude = 39.5;
    name = "Unites States";
    address = "US";
  }

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
    properties: {
      key,
      name: name,
      address: address,
      confirmed: confirmed,
      deaths: deaths,
      recovered: recovered,
      total_cases: total_cases,
    },
  };
};

const calculateStatistics = (db_data) => {
  let data = [];
  let total_cases = 0;
  let us_item;
  let statsByCountry = db_data.country_statistics;

  for (let i = 0; i < statsByCountry.length; i++) {
    let { country } = statsByCountry[i];
    if (country == "US") {
      us_item = createItem(statsByCountry[i], 9899545);
    }
    for (let j = 0; j < statsByCountry[i].states.length; j++) {
      if (country != "US") {
        let item = createItem(statsByCountry[i].states[j], j);
        data.push(item);
      }
    }
  }
  data.push(us_item);
  return data;
};

const markers = (req, res) => {
  try {
    client.connect(function (err) {
      const db = client.db(dbConfig.name);

      db.collection(dbConfig.collection)
        .find()
        .toArray((err, results) => {
          if (err) throw err;
          let result = JSON.parse(JSON.stringify(results[0]));
          let data = calculateStatistics(result);
          res.json(data);
        });
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  summary,
  markers,
};
