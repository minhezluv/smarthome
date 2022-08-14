import { useEffect, useState } from "react";
// import React in our code
import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
const Dropdown = () => {
  let optionsMonth = [];
  let day = [];
  for (let i = 1; i < 32; i++) {
    day.push(`${i}`);
  }
  for (let i = 0; i < 12; i++) {
    let element = { value: "", text: "" };
    element.value = `${i + 1}`;
    element.text = `${i + 1}`;
    optionsMonth.push(element);
  }
  let currMonth = new Date().getMonth() + 1;
  const [selected, setSelected] = useState(optionsMonth[currMonth - 1].value);

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelected(event.target.value);
    currMonth = event.target.value;
    fetchData();
  };

  const [data, setData] = useState({
    labels: day,
    datasets: [
      {
        data: [],
      },
    ],
  });
  async function fetchData() {
    console.log("month: ", currMonth);
    const url = `http://192.168.1.2:8080/api/powerdevice/day/1/${currMonth}`;
    const dataSet = [];
    await fetch(url)
      .then((data) => {
        console.log("Api data", data);
        const res = data.json();
        return res;
      })
      .then((res) => {
        console.log("ressss", res);
        for (const val of res) {
          dataSet.push(val);
        }
        setData({
          labels: day,
          datasets: [
            {
              data: dataSet,
            },
          ],
        });
        //console.log("arrData", dataSet1, dataSet2)
      })
      .catch((e) => {
        console.log("error", e);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <LineChart
        data={data}
        width={Dimensions.get("window").width - 16} // from react-native
        height={220}
        yAxisLabel={"Rs"}
        chartConfig={{
          backgroundColor: "#1cc910",
          backgroundGradientFrom: "#eff3ff",
          backgroundGradientTo: "#efefef",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <select
        // style={{ marginTop: "30%", marginVertical: "30%" }}
        value={selected}
        onChange={handleChange}
      >
        {optionsMonth.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
