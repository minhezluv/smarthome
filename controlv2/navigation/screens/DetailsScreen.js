// 7 Type of Graph using React Native Chart Kit
// https://aboutreact.com/react-native-chart-kit/

// import React in our code
import React from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
//import React Native chart Kit for different kind of Chart
import  { Component } from 'react';

import axios from 'axios'


export default class DetailsScreen extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{}
    }
  }

  componentDidMount() {
    this.getChartData();
  }

  getChartData() {
 
try {
  axios.get("http://localhost:8080/api/powerdevice/month/1").then(res => {
    const coin = res.data;
    //let labels = [];
    let thisdata = [];
    coin.forEach(element => {
 //   labels.push(element.labels);
    thisdata.push(element);

      });

   console.log(coin)
    this.setState({
      chartData: {
        
          labels: ['January', 'February', 'March', 'April','May','June','July','August','November','October','September','December'],
          datasets: [
            {
              data: thisdata,
            },
          ],
        }
    });
  });
} catch (error) {
  console.log(error);
}
    }

  render(){

        return (
          <>
          <Text style={styles.header}>Bezier Line Chart</Text>
          {Object.keys(this.state.chartData).length >0 ?
          <LineChart
            data={this.state.chartData}
            width={Dimensions.get('window').width - 16} // from react-native
            height={220}
            yAxisLabel={'Rs'}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
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
          /> : null}
        </>
        );

    }     
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});