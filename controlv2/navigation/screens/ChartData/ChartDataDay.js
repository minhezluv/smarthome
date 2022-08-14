import { useEffect, useState } from "react";
// import React in our code
import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
const ChartDataDay = () => {
  let optionsMonth = [];
  let day = [];
  let data_set = [];
  for (let i = 1; i < 32; i++) {
    day.push(`${i}`);
    data_set.push(0);
  }
  //   for (let i = 0; i < 12; i++) {
  //     let element = { value: "", text: "" };
  //     element.value = "${i + 1}";
  //     element.text = "${i + 1}";
  //     optionsMonth.push(element);
  //   }
  //   console.log();
  let currMonth = new Date().getMonth() + 1;

  //   const [open, setOpen] = useState(false);
  //   const [value, setValue] = useState(["1", "2"]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currMonth.toString());
  const [items, setItems] = useState([
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
  ]);
  //   optionsMonth = [
  //     { value: "1", text: "1" },
  //     { value: "2", text: "2" },
  //     { value: "3", text: "3" },
  //     { value: "4", text: "4" },
  //     { value: "5", text: "5" },
  //     { value: "6", text: "6" },
  //     { value: "7", text: "7" },
  //     { value: "8", text: "8" },
  //     { value: "9", text: "9" },
  //     { value: "10", text: "10" },
  //     { value: "11", text: "11" },
  //     { value: "12", text: "12" },
  //   ];

  //   const [selected, setSelected] = useState(optionsMonth[currMonth - 1].value);
  //   console.log(selected);

  //   const change = (event) => {
  //     if (currMonth != event) {
  //       currMonth = event;
  //     }
  //   };
  const [data, setData] = useState({
    labels: day,
    datasets: [
      {
        data: data_set,
      },
    ],
  });
  async function fetchData() {
    const url = `http://192.168.1.16:8080/api/powerdevice/day/1/${currMonth}`;
    const dataSet = [];
    await fetch(url)
      .then((data) => {
        const res = data.json();
        return res;
      })
      .then((res) => {
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
      })
      .catch((e) => {});
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      {1 > 0 ? (
        <ScrollView horizontal={true}>
          <LineChart
            data={data}
            width={Math.max(Dimensions.get("window").width, 550)} // from react-native
            height={220}
            yAxisLabel={"W"}
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
        </ScrollView>
      ) : null}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={{
          backgroundColor: "white",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
        onSelectItem={(item) => {
          currMonth = item.value;

          fetchData();
        }}
      />
    </View>
  );
};

export default ChartDataDay;
