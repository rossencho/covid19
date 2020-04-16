module.exports = {
  getStatistics: function getStatistics(country_obj, results) {
    const statistics = [];

    var country;
    var code;
    var flag;
    var coordinates;

    var confirmed = 0;
    var deaths = 0;
    var recovered = 0;

    var state_name;
    var state_latitude;
    var state_longitude;
    var state_address;
    var state_confirmed_count = 0;
    var state_deaths_count = 0;
    var state_recovered_count = 0;

    var country_statistics;

    for (var i = 0; i < results.length; i++) {
      if (results[i].Country_Region == country_obj.country) {
        country = results[i].Country_Region;
        code = country_obj.code;
        flag = country_obj.flag;
        coordinates = country_obj.coordinates;

        confirmed = parseInt(results[i].Confirmed) + confirmed;
        deaths = parseInt(results[i].Deaths) + deaths;
        recovered = parseInt(results[i].Recovered) + recovered;

        if (results[i].Province_State.length > 0) {
          state_name = results[i].Province_State;
        } else {
          state_name = country;
        }
        state_address = results[i].Combined_Key;

        if (results[i].Lat.length > 0 && results[i].Long_.length > 0) {
          state_latitude = parseFloat(results[i].Lat);
          state_longitude = parseFloat(results[i].Long_);
        } else {
          state_latitude = 0.0;
          state_longitude = 0.0;
        }

        state_confirmed_count = results[i].Confirmed;
        state_deaths_count = results[i].Deaths;
        state_recovered_count = results[i].Recovered;

        var state_statistics = {
          key: Math.random().toString(36).substr(2, 5),
          name: state_name,
          address: state_address,
          latitude: state_latitude,
          longitude: state_longitude,
          confirmed: state_confirmed_count,
          deaths: state_deaths_count,
          recovered: state_recovered_count,
        };
        statistics.push(state_statistics);
      }
    }
    country_statistics = {
      country: country,
      code: code,
      flag: flag,
      coordinates: coordinates,
      confirmed: confirmed,
      deaths: deaths,
      recovered: recovered,
      states: statistics,
    };
    return country_statistics;
  },
};
