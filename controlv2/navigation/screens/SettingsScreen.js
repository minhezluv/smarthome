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
}); // Inicia um BackEnd para armazenar os dados do MQTT

var x=""; // Criar a variavel x Como uma String
var Ledoff = "OFF"; // Criar a variavel Ledoff Como uma String
var Ledon = "ON"; // Criar a variavel Ledon Como uma String
var EstadoLed = false; // Criar a variavel EstadoLed Como um Bollean
var state="0";
function onConnect() { // Criar a funcao que Mostrara quando a conexão e feita
  console.log("Conectado"); // Mostra no Console o texto Conectado
  client.subscribe("state"); // Se increve no topico
}

function onConnectionLost(responseObject) { // Criar a funcao de encontrar o Erro caso nao consiga uma conexão com o mqtt
  if (responseObject.errorCode !== 0) { // Espera uma resposta do Codigo de erro Diferente de zero
    console.log("Conexão perdida erro:"+responseObject.errorMessage); // Mostar na tela a Mensagem de erro
  }
}
var idclient=Math.random().toString(36).substring(2,7)
 var client = new Paho.MQTT.Client('broker.emqx.io', 8083, idclient); // Criar a constante que sera usada na conexão com o MQTT

 client.onConnectionLost = onConnectionLost; // Caso Tenha algom erro na conexão Inicia a funcao onConnectionLost
 client.connect({ onSuccess:onConnect, useSSL: false, userName: "Minh", password:"123456" }); // Inicia a conexão usando Username e o Password do MQTT

 export default class  SettingsScreen extends Component { 
  constructor(props) { 
    super(props); 
    this.state={ 
      data: "Ola", 
      TitleText: "ON",  
      ButtonText: "OFF",  
      DeviceState:"Chưa xác định"
    }
  }
  componentDidMount() { 
    client.onMessageArrived=(message)=>this.onMessageArrived(message); 
  }

  onMessageArrived  = (message) => 
  {
    let x = message.payloadString; 
    let y =JSON.parse(x);
    x=y["state"];
    let z=y["devicestate"];
    if(state!=x){
      if(x==1){
        this.setState({
          data: "Ola", 
          TitleText: "OFF",  
          ButtonText: "ON", 
          
        })
        
      } else{
        this.setState({
          data: "Ola", 
          TitleText: "ON",  
          ButtonText: "OFF", 
        })
        
      }
      state=x;
    //  EstadoLed = !EstadoLed; 
    }
    if(z==1){
      this.setState({
        DeviceState:"Thiết bị điện đã hoạt động"
      })
    }else{
      this.setState({
        DeviceState:"Thiết bị điện chưa hoạt động"
      })
    }
    console.log(z); 
   
  }
  
  click  = () => 
  {
    EstadoLed = !EstadoLed; 
    if (EstadoLed == false){ 
      this.setState({TitleText:Ledoff}) 
      this.setState({ButtonText:Ledon}) 
      var temp={msg:"0"}
      this.state=1;
    }
    else { 
      this.setState({TitleText:Ledon}) 
      this.setState({ButtonText:Ledoff}) 
      var temp={msg:"1"}
      this.state=0;
    }
    client.publish("ledclient", JSON.stringify(temp));
  }
  
  
  render() { 
    return (
      <View style={styles.container}> 
          <View>
            <Text style={styles.title}>Plug {this.state.TitleText}</Text>
          </View>
          <TouchableOpacity onPress={()=>this.click()}>
            <Text style={styles.Button}>{this.state.ButtonText}</Text>
          </TouchableOpacity>  
          <View>
            <Text style={styles.title}> {this.state.DeviceState}</Text>
          </View> 
      </View>
    );
  }
}


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