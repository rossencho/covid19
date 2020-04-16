const cron = require("node-cron");
const request = require("request");
const fs = require("fs");
const csv = require("csv-parser");
const dbConfig = require("./config/defines");
const countryList = require("./country_list.json");
const getStatistics = require("./prepare").getStatistics;
const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(dbConfig.url, { useUnifiedTopology: true });

function cronWrapper() {
  cron.schedule("59 2 * * *", async function () {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate() - 1;
    var year = dateObj.getUTCFullYear();

    var month_name = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUNE",
      "JULY",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    var formattedMonth = month;
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    var formatted_date =
      day + " " + month_name[formattedMonth - 1] + " " + year;
    var fileName = month + "-" + day + "-" + year + ".csv";

    var results = [];
    var data = [];
    var totalConfirmed = 0;
    var totalDeaths = 0;
    var totalRecovered = 0;

    const file = fs.createWriteStream(fileName);

    await new Promise((resolve, reject) => {
      request({
        uri:
          "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/" +
          fileName,
      })
        .pipe(file)
        .on("finish", () => {
          fs.createReadStream(fileName)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
              if (results.length) {
                for (var i = 0; i < results.length; i++) {
                  totalConfirmed =
                    parseInt(results[i].Confirmed) + totalConfirmed;
                  totalDeaths = parseInt(results[i].Deaths) + totalDeaths;
                  totalRecovered =
                    parseInt(results[i].Recovered) + totalRecovered;
                }
                for (var j = 0; j < countryList.length; j++) {
                  var country_obj = JSON.parse(JSON.stringify(countryList[j]));

                  let state = getStatistics(country_obj, results);
                  data.push(state);
                }

                var items = {
                  total_confirmed: totalConfirmed,
                  total_deaths: totalDeaths,
                  total_recovered: totalRecovered,
                  last_date_updated: formatted_date,
                  country_statistics: data.sort(
                    (a, b) => b.confirmed - a.confirmed
                  ),
                };
                try {
                  client.connect(function (err) {
                    const db = client.db(dbConfig.name);
                    db.collection(dbConfig.collection).deleteOne({});
                    db.collection(dbConfig.collection).insertOne(items);
                  });
                } catch (err) {
                  console.log(err);
                }
              }
            });
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    }).catch((error) => {
      console.log(`Something happened: ${error}`);
    });
  });
}

module.exports = {
  cronjob: cronWrapper,
};
