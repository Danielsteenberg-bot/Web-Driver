#ifndef WIFI_H
#define WIFI_H

#include <WiFiS3.h>
#include <Arduino.h>

#include "settings.h"
#include "queue.h"
#include "cooldown.h"

#define CONNECT_MESSAGE "0"+String(DEVICE_ID)+"\n"
#define PING_MESSAGE "8\n"
#define PONG_MESSAGE "9\n"

typedef struct Message {
    uint8_t type;
    char message[50];
} Message;

WiFiClient* wifi_handle_connection(void (*handler)(const char*, WiFiClient* client));

void wifi_begin_client();
void wifi_begin_server();

extern WiFiClient client;
extern WiFiServer server;
extern Queue<Message, 25> queue;

#endif