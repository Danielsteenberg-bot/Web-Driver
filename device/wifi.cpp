#include "wifi.h"

void wifi_begin() {
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("communication with wifi module failed");
  }

  String v = WiFi.firmwareVersion();
  if (v < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("please upgrade the firmware");
  }

  WiFi.config(IPAddress(192,168,8,8));

  char ssid[50];
  snprintf(ssid, sizeof(ssid), "web-driver-%d", DEVICE_ID);

  Serial.print("creating access point named: ");
  Serial.println(ssid);

  uint8_t status = WiFi.beginAP(ssid, AP_PASSWORD);
  if (status != WL_AP_LISTENING) {
    Serial.println("creating access point failed");
  }

  delay(10000);

  server.begin();
  wifi_print_status();
}

void wifi_print_status() {
  Serial.print("ssid: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("ip address: ");
  Serial.println(ip);
}

String message = "";

void wifi_handle_client(void (*handler)(const char*)) {
  WiFiClient client = server.available();

  if (!client) { 
    COOLDOWN(200, { digitalWrite(LED_BUILTIN, LOW); });  
    return;
  }

  digitalWrite(LED_BUILTIN, HIGH);


  while (client.available() > 0) {
    char byte = client.read();

    if (byte == '\n') {
        handler(message.c_str());
        message = "";
        continue;
    }

    message += byte;
  }

  Message next = out_queue.next();
  
  while (next.type != 0) {
    char message[50];
    snprintf(message, sizeof(message), "%d%s\n", next.type, next.message);
    client.write(message);
    next = out_queue.next();
  }
}