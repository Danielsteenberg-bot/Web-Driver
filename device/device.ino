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

unsigned long left_time;
unsigned long right_time;
unsigned long forward_time;
unsigned long backward_time;

Queue<Message, 50> queue;
WiFiClient client;
WiFiServer server(80);

unsigned int original_rotation = 9999;

unsigned int normalize_rotation(unsigned int angle) {
    while (angle < 0) {
        angle += 3600;
    }
    while (angle >= 3600) {
        angle -= 3600;
    }
    return angle;
}

void read_sonar() {
    Message message = { .type = 3 };
    snprintf(message.message, sizeof(message.message), "%d,%d,%d", sonar_front.ping_cm(), sonar_left.ping_cm(), sonar_right.ping_cm());
    queue.add(message);
  }
    
void read_gps() {
  while (gps.available( gps_serial )) {
    gps_fix gps_data = gps.read();

    if (gps_data.valid.location) {
      Message message = { .type = 1 };
      snprintf(message.message, sizeof(message.message), "%.6f,%.6f", gps_data.latitude(), gps_data.longitude());
      queue.add(message);
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

  if (original_rotation == 9999) {
    original_rotation = rotation;
  }

  rotation = normalize_rotation(rotation - original_rotation);

  Message message = { .type = 2 };
  snprintf(message.message, sizeof(message.message), "%d.%d", rotation / 10, rotation % 10);
  queue.add(message);
}

void read_velocity() {
  if (DISABLE_CMPS11) return;
 
  Wire.beginTransmission(CMPS11_ADDRESS);
  Wire.write(14);                    
  Wire.endTransmission();

  Wire.requestFrom(CMPS11_ADDRESS, 2);       
  while(Wire.available() < 2);     

  unsigned char high_byte = Wire.read();
  unsigned char low_byte = Wire.read();
  
  unsigned int velocity = high_byte;             
  velocity <<= 8;
  velocity += low_byte;

  Message message = { .type = 4 };
  snprintf(message.message, sizeof(message.message), "%d", velocity);
  queue.add(message);
}

void setup() {
  left_motor.attach(13);
  right_motor.attach(12);
  
  left_motor.writeMicroseconds(LEFT_STILL);
  right_motor.writeMicroseconds(RIGHT_STILL);
  
  Serial.begin(115200);
  while (!Serial);

  #if WIFI_CLIENT
    wifi_begin_client();
  #else 
    wifi_begin_server();
  #endif
  
  Wire.begin();
  gps_serial.begin(9600);
}

void loop() {
  // sets the motor speed based on the last action recieved
  drive();

  // read all sensors
  read_rotation();
  read_velocity(); 
  read_gps();
  read_sonar();

  WiFiClient* client = wifi_handle_connection([](const char *message, WiFiClient* client) {
    int size = sizeof(message);

    if (size < 2) {
      return;
    }

    uint8_t _type = message[0] - '0';
    
    if (_type == 1) { 
      for (size_t i = 0; i < size-1; i++) {
        switch (message[i+1]) {
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

      drive();
    
    } else if (_type == 8) {
      Serial.println("[PROXY] recieved ping");
      client->println(PONG_MESSAGE); 
    
    } else if (_type == 9) {
      Serial.println("[PROXY] recieved pong");
    }
  });
}