#include <NMEAGPS.h>
#include <Wire.h>
#include <NewPing.h>
#include <Servo.h>

#include "settings.h"
#include "cooldown.h"
#include "wifi.h"
#include "drive.h"


#define gps_serial Serial1

NMEAGPS gps;

NewPing sonar_front(FRONT_PING_PIN, FRONT_ECHO_PIN, 300);
NewPing sonar_left(LEFT_PING_PIN, LEFT_ECHO_PIN, 300);
NewPing sonar_right(RIGHT_PING_PIN, RIGHT_ECHO_PIN, 300);

Servo left_motor;
Servo right_motor;

long left_time;
long right_time;
long forward_time;
long backward_time;

WiFiServer server(80);
WiFiClient *client;
Queue<Message, 50> out_queue;

void read_sonar() {
    Message message = { .type = 3 };
    snprintf(message.message, sizeof(message.message), "%d,%d,%d", sonar_front.ping_cm(), sonar_left.ping_cm(), sonar_right.ping_cm());
    // Serial.println(message.message);
    out_queue.add(message);
  }
    
void read_gps() {
  while (gps.available( gps_serial )) {
    gps_fix gps_data = gps.read();

    if (gps_data.valid.location) {
      Message message = { .type = 1 };
      snprintf(message.message, sizeof(message.message), "%.6f,%.6f", gps_data.latitude(), gps_data.longitude());
      // Serial.println(message.message);
      out_queue.add(message);
    }
  }
}

void read_rotation() {
  if (DISABLE_CMPS11) return;
 
  Wire.beginTransmission(CMPS11_ADDRESS);
  Wire.write(2);                    
  Wire.endTransmission();

  Wire.requestFrom(CMPS11_ADDRESS, 2);       
  while(Wire.available() < 2);     

  unsigned char high_byte = Wire.read();
  unsigned char low_byte = Wire.read();
  
  unsigned int rotation = high_byte;             
  rotation <<= 8;
  rotation += low_byte;

  Message message = { .type = 2 };
  snprintf(message.message, sizeof(message.message), "%d.%d", rotation / 10, rotation % 10);
  // Serial.println(message.message);
  out_queue.add(message);
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);

  left_motor.attach(13);
  right_motor.attach(12);
  
  Serial.begin(9600);
  while (!Serial);

  left_motor.writeMicroseconds(E);
  right_motor.writeMicroseconds(1700);

  wifi_begin();
  Wire.begin();
  gps_serial.begin(9600);
}

void loop() {
  read_sonar();
  read_rotation(); 
  read_gps();

  wifi_handle_client([](const char *message) {
    int size = sizeof(message);

    if (size < 2) {
      continue;
    }

    uint8_t type = message[0] - '0'
    
    if (type == 1) { 
        switch (message[1]) {
        case 'F':
          forward_time = millis();
          break;
        case 'B':
          backward_time = millis();
          break;
        case 'L':
          left_time = millis();
          break;
        case 'R':
          right_time  = millis();
          break;
        }
    }
    
  });

}