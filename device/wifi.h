#ifndef WIFI_H
#define WIFI_H

#include <WiFiS3.h>

#include "settings.h"
#include "queue.h"
#include "cooldown.h"

typedef struct Message {
    uint8_t type;
    char message[50];
} Message;

void wifi_begin();
void wifi_print_status();
void wifi_handle_client(void (*handler)(const char*));

extern WiFiClient *client;
extern WiFiServer server;
extern Queue<Message, 50> out_queue;

#endif