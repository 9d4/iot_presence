#include <constants.h>
#include <pins.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <PubSubClient.h>
#include <WiFiManager.h>

// GLOBAL VARIABLES
MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClient wifiClient;
PubSubClient client(wifiClient);
String lastRfid = "";

//dev
int counter = 0;

String readRFID()
{
  Serial.print("UID tag  :");
  String rfid_content = "";

  for (byte i = 0; i < rfid.uid.size; i++)
  {
    Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(rfid.uid.uidByte[i], HEX);
    rfid_content.concat(String(rfid.uid.uidByte[i] < 0x10 ? " 0" : " "));
    rfid_content.concat(String(rfid.uid.uidByte[i], HEX));
  }

  rfid_content.toUpperCase();
  Serial.println();

  MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
  Serial.print("Card Type: ");
  Serial.println(rfid.PICC_GetTypeName(piccType));

  return rfid_content.substring(1);
}

void mqttAutoConnect()
{
  while (true)
  {
    if (!client.connect(MQTT_ID, MQTT_USERNAME, MQTT_PASSWORD))
    {
      Serial.print("Reconnecting to MQTT Server ");

      for (size_t i = 0; i < 5; i++)
      {
        Serial.print(".");
        delay(200);
      }

      Serial.println();
      continue;
    }
    Serial.println("Connected to MQTT Server");
    break;
  }
}

void onCardSuccess()
{
  tone(BUZZER, 1200);
  delay(70);
  noTone(BUZZER);
  delay(50);

  tone(BUZZER, 1200);
  delay(70);
  noTone(BUZZER);
  delay(50);

  tone(BUZZER, 1200);
  delay(70);
  noTone(BUZZER);

  Serial.println("Data sent!");
  Serial.println();
}

void onCardDetected()
{
  const String rfid = readRFID();

  if (lastRfid == rfid)
  {
    // return;
  }

  lastRfid = rfid;

  DynamicJsonDocument payloadJson(1024);
  char payload[2048] = "";

  payloadJson["rfid"] = rfid;

  serializeJson(payloadJson, payload);

  mqttAutoConnect();
  client.publish(MQTT_TOPIC, payload);

  // data uploaded = done!
  onCardSuccess();
}

void setup()
{
  setupPins();

  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();

  // WiFi stuffs
  WiFiManager wifiManager;
  wifiManager.autoConnect(AP_SSID, AP_PASSWORD);

  // MQTT Stuffs
  client.setServer(MQTT_SERVER, MQTT_PORT);
  mqttAutoConnect();

  // ready led off
  digitalWrite(LED_READY, HIGH); // HIGH IS OFF BECAUSE THE COM WIRE IS IN 3v
}

void loop()
{
  if (!rfid.PICC_IsNewCardPresent())
  {
    return;
  }

  if (!rfid.PICC_ReadCardSerial())
  {
    return;
  }

  digitalWrite(LED_READY, LOW);

  onCardDetected();
  delay(700);

  digitalWrite(LED_READY, HIGH);
}
