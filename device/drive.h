#ifndef DRIVE_H
#define DRIVE_H

#include <Servo.h>
#include <Arduino.h>
#include "settings.h"
#include "cooldown.h"

#define LEFT_FORWARD 1700
#define RIGHT_FORWARD 1300

#define LEFT_BACKWARD 1300
#define RIGHT_BACKWARD 1700

#define LEFT_STILL 1500
#define RIGHT_STILL 1500

void drive();

extern unsigned long left_time;
extern unsigned long right_time;
extern unsigned long forward_time;
extern unsigned long backward_time;

extern Servo left_motor;
extern Servo right_motor;

#endif