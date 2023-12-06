#include <NMEAGPS.h>

#define gps_serial Serial1

static gps_fix gps_data;
static NMEAGPS gps;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  gps_serial.begin(9600);
}

void loop() {
  while (gps.available( gps_serial )) {
    gps_data = gps.read();

    Serial.print( F("Location: ") );
    if (gps_data.valid.location) {
      Serial.print( gps_data.latitude(), 6 );
      Serial.print( ',' );
      Serial.print( gps_data.longitude(), 6 );
    }

    Serial.print( F(", Altitude: ") );
    if (gps_data.valid.altitude) {
      Serial.print( gps_data.altitude());
    }

    Serial.println();
  }
}