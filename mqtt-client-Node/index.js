const mqtt = require('mqtt')
const fs = require('fs')
var sql=require('./connectsql')
const { Command } = require('commander')
const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();
const program = new Command()
program
  .option('-p, --protocol <type>', 'connect protocol: mqtt, mqtts, ws, wss. default is mqtt', 'mqtt')
  .parse(process.argv)

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

// connect options
const OPTIONS = {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'minh',
  password: '123456',
  reconnectPeriod: 1000,
}
// protocol list
const PROTOCOLS = ['mqtt', 'mqtts', 'ws', 'wss']

// default is mqtt, unencrypted tcp connection
let connectUrl = `mqtt://${host}:${port}`
if (program.protocol && PROTOCOLS.indexOf(program.protocol) === -1) {
  console.log('protocol must one of mqtt, mqtts, ws, wss.')
} else if (program.protocol === 'mqtts') {
  // mqtts， encrypted tcp connection
  connectUrl = `mqtts://${host}:8883`
  OPTIONS['ca'] = fs.readFileSync('./broker.emqx.io-ca.crt')
} else if (program.protocol === 'ws') {
  // ws, unencrypted WebSocket connection
  const mountPath = '/mqtt' // mount path, connect emqx via WebSocket
  connectUrl = `ws://${host}:8083${mountPath}`
} else if (program.protocol === 'wss') {
  // wss, encrypted WebSocket connection
  const mountPath = '/mqtt' // mount path, connect emqx via WebSocket
  connectUrl = `wss://${host}:8084${mountPath}`
  OPTIONS['ca'] = fs.readFileSync('./broker.emqx.io-ca.crt')
} else {}

const topic = 'data/1'

const client = mqtt.connect(connectUrl, OPTIONS)

client.on('connect', () => {
  console.log(`${program.protocol}: Connected`)
  client.subscribe([topic], () => {
  
  })
})

client.on('reconnect', (error) => {
  console.log(`Reconnecting(${program.protocol}):`, error)
})

client.on('error', (error) => {
  console.log(`Cannot connect(${program.protocol}):`, error)
})

client.on('message', (topic, payload) => {
  try {
    console.log('Received Message:', topic,payload.toString());
    const message = JSON.parse(payload.toString())
  
   console.log(parseInt(message.deviceid));
   if(parseInt(message.deviceid)>0){
    console.log("hi");
    let tempdate=(message.date)*1000;

    let time=new Date(tempdate).toISOString().slice(0, 19).replace('T', ' ');
    console.log(time);
    let power=message.power;
    let customerdeviceid=message.deviceid.toString();
    if(power>0){
      let data=[power,customerdeviceid,time];
      sql.insertData(data);
      console.log('success');
    }
  
   } 
  } catch (error) {
    console.log(error);
  }

})
var corsOptions = {
  origin: "http://192.168.0.101:8081",
  optionsSuccessStatus: 200
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./routes/powerdevice.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const HOST=process.env.HOST || "192.168.0.101";
app.listen(PORT,HOST, () => {
  console.log(`Server is running on HOST ${HOST}.`);
//  console.log(`Server is running on server ${app.address().address}.`);
});