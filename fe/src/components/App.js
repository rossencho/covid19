import React from "react";
import "./App.css";
import store from "../store";
import { Provider } from "react-redux";
import CoronaStatisticsProvider from "./statistics/CoronaStatisticsProvider";
import MapProvider from "./map/MapProvider";

const App = () => {
  return (
    <Provider store={store}>
      <MapProvider />
      <CoronaStatisticsProvider />
    </Provider>
  );
};

export default App;
