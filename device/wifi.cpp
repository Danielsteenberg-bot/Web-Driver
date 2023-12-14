#include "wifi.h"

void wifi_begin_client() {
  
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("communication with wifi module failed");
    while(true);
  }

  String v = WiFi.firmwareVersion();
  if (v < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("please upgrade the firmware");
    while(true);
  }

  Serial.print("trying to connect to wifi: ");
  Serial.println(WIFI_SSID);
  
  Start:
    int status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    
    if (status != WL_CONNECTED) {
      delay(10000);
      goto Start;
    }

  Serial.print("connected to wifi: ");
  Serial.println(WIFI_SSID);
}

void wifi_begin_server() {
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("communication with wifi module failed");
    while(true);
  }

  String v = WiFi.firmwareVersion();
  if (v < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("please upgrade the firmware");
    while(true);
  }

  WiFi.config(IPAddress(192,168,8,8));

  char ssid[50];
  snprintf(ssid, sizeof(ssid), "web-driver-%d", DEVICE_ID);

  Serial.print("creating access point named: ");
  Serial.println(ssid);

  uint8_t status = WiFi.beginAP(ssid, AP_PASSWORD);

  if (status != WL_AP_LISTENING) {
    Serial.println("creating access point failed");
    while(true);
  }
  
  delay(10000);
  server.begin();

  Serial.println("created access point");
  Serial.print("ssid: ");
  Serial.println(WiFi.SSID());
  Serial.print("ip address: ");
  Serial.println(WiFi.localIP());
}

String message = "";

WiFiClient* wifi_handle_connection(void (*handler)(const char*, WiFiClient* client)) {
  
  #if WIFI_CLIENT
    if (!client.connected()) { 
     client.connect(PROXY_IP, PROXY_PORT); 
     client.print(CONNECT_MESSAGE);
    }
  #else
    WiFiClient client = server.available();
  #endif

  if (!client || !client.connected()) { 
    return NULL;
  }

  while (client.available() > 0) {
    char byte = client.read();

    if (byte == '\n') {
        handler(message.c_str(), &client);
        message = "";
        continue;
    }

    message += byte;
  }

  Message next = queue.next();
  
  while (next.type != 0) {
    char message[50];
    snprintf(message, sizeof(message), "%d%s\n", next.type, next.message);
    client.write(message);
    next = queue.next();
  }

  return &client;
}