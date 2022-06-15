import React, { Component  } from 'react'; // Importa o React e o React components
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importa os componentes do react native

import init from 'react_native_mqtt'; // Importa a biblioteca React Native MQTT 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa a biblioteca do AsyncStore que e Necessaria para usar o MQTT

init({ 
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync : {}
}); 

var x=""; 
var Ledoff = "OFF";
var Ledon = "ON";
var EstadoLed = false; 

function onConnect() { 
  console.log("connection");
  client.subscribe("Topic User"); 
}

function onConnectionLost(responseObject) { 
  if (responseObject.errorCode !== 0) { 
    console.log("disconnect"+responseObject.errorMessage); 
  }
}
var idclient=Math.random().toString(36).substring(2,7)
 var client = new Paho.MQTT.Client('broker.emqx.io', 8083, idclient); 

 client.onConnectionLost = onConnectionLost; 
 client.connect({ onSuccess:onConnect, useSSL: false, userName: "Minh", password:"123456" });

class App extends Component { 
  constructor(props) { 
    super(props); 
    this.state={ 
      data: "Ola", 
      TitleText: "OFF",  
      ButtonText: "ON",  
    }
  }
  componentDidMount() { 
    client.onMessageArrived=(message)=>this.onMessageArrived(message); 
  }

  onMessageArrived  = (message) => 
  {
    let x = "\nTopic : "+message.topic+"\nMessage : "+message.payloadString; 
    console.log(x); 
    this.setState({data:x}); 
  }
  
  click  = () => 
  {

  
   // client.publish("data","0");
    EstadoLed = !EstadoLed; 
    if (EstadoLed == false){ 
      this.setState({TitleText:Ledoff}) 
      this.setState({ButtonText:Ledon}) 
      var temp={msg:"0"}
     
    }
    else { 
      this.setState({TitleText:Ledon}) 
      this.setState({ButtonText:Ledoff}) 
      var temp={msg:"1"}
    }
    client.publish("ledclient", JSON.stringify(temp));
  }
  
  
  render() { 
    return (
      <View style={styles.container}> 
          <View>
            <Text style={styles.title}>LED {this.state.TitleText}</Text>
          </View>
          <TouchableOpacity onPress={()=>this.click()}>
            <Text style={styles.Button}>{this.state.ButtonText}</Text>
          </TouchableOpacity>   
      </View>
    );
  }
}

export default App; 

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: "normal",
    fontSize: 20,
    fontWeight: "bold",
    color:"#FFFFFF", 
    textAlign: 'center'
  },
  Button: {
    margin: 20,
    padding:15,
    width: 80,
    fontFamily: "normal",
    backgroundColor: "#000dff",
    borderRadius:10, 
    color:"#FFFFFF", 
    textAlign: 'center'
  }
});
