#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <String.h>
#include <PZEM004Tv30.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#define RXD2 16 
#define TXD2 17
// setup MQTT
#define MQTT_SERVER "broker.emqx.io"
#define MQTT_PORT 1883
#define MQTT_USER "Minh"
#define MQTT_PASSWORD "123456"
#define MQTT_LED_TOPIC "ledclient"
#define MQTT_SCHEDULE_TOPIC "data/1"
#define MQTT_STATE_TOPIC "state"
#define PZEM_SERIAL Serial2
const char *ssid = "wifi";       // Enter your WiFi name
const char *password = "minhnqhust99"; // Enter WiFi passwor
// json
DynamicJsonDocument mess_publish(400);
DynamicJsonDocument mess_subcribe(400);
DynamicJsonDocument mess_state(100);
PZEM004Tv30 pzem(PZEM_SERIAL, RXD2, TXD2);
//IPAddress ip(192,168,1);
WiFiClient wifiClient;
PubSubClient client(wifiClient);
//datetime
String formattedDate;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
unsigned long previousMillis = 0; 
//power
float v;  // variable for voltage
float c;  // variable for current
float p=0;  // variable for power
float e;  // variable for energy
const int Led = 27;
const int ledesp=2;
bool light=true;
bool prevlight=false;
int state_plug=1;
int state_device=0;
void setup_wifi()
{
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void connect_to_broker()
{
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    String clientId = "11";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD))
    {
      Serial.println("connected");
      client.subscribe(MQTT_LED_TOPIC);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
    }
  }
}
void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.println("-------new message from broker-----");
  Serial.print("topic: ");
  Serial.println(topic);
  Serial.print("message: ");
  Serial.println();
  char *messageTemp;
  messageTemp = (char *)malloc((length + 1) * sizeof(char));
  memset(messageTemp, 0, length + 1);
  for (int i = 0; i < length; i++)
  {
    messageTemp[i] = (char)payload[i];
  }
  Serial.println("sub mess: ");
  Serial.println(messageTemp);
  deserializeJson(mess_subcribe, messageTemp);
  if (strcmp(mess_subcribe["msg"], "0") == 0)
    {
     light=false;
    }
  else{
    light=true;
  }
}

void publish(float currp){
  char buffer[256];

    timeClient.forceUpdate();

  unsigned long date=timeClient.getEpochTime();
  mess_publish["date"]=date;
 mess_publish["power"] = currp;
  //mess_publish["power"] = 2;
  mess_publish["deviceid"]="1";
  serializeJson(mess_publish, buffer);
  client.publish(MQTT_SCHEDULE_TOPIC, buffer);
  p=currp;
  Serial.println("published");
}
void publish_state(int state_plug,int state_device){
  char buffer[256];
  mess_state["state"]=state_plug;
  mess_state["devicestate"] = state_device;
  serializeJson(mess_state, buffer);
  client.publish(MQTT_STATE_TOPIC, buffer);
  Serial.println("published state");
}
void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  Serial.println("connected to PZEM");
  pinMode (Led, OUTPUT);
  setup_wifi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
  connect_to_broker();
  while (!Serial)
    continue;
  timeClient.begin();
  timeClient.setTimeOffset(25200);
}

void loop()
{
  if(light){
      digitalWrite(Led,LOW);     
      delay(100);
  }else{
      digitalWrite(Led,HIGH);
      delay(100);  
  }
  if(light!=prevlight){
    if(light) state_plug=0;
    else state_plug=1;
    publish_state(state_plug,state_device);
    prevlight=light;
  }
//  plugState=digitalRead(Led);
  unsigned long time=millis();
  if(time-previousMillis>=20000){
    float currp=pzem.power()*20/3600;
    state_device=0;
    if(currp>0.0034) state_device=1;
    else state_device=0;
    publish_state(state_plug,state_device);
    publish(currp);
    previousMillis=time;
    Serial.println(time);
    Serial.println(currp);
  }
  client.loop();
}