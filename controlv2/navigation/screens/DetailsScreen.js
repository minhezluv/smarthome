import * as React from "react";
import ChartDataMonth from "./ChartData/ChartDataMonth";
import ChartDataDay from "./ChartData/ChartDataDay";
import { View } from "react-native";
function DetailsScreen() {
  return (
    <View >
      <ChartDataMonth />
      <ChartDataDay />
    </View>
  );
}

export default DetailsScreen;
