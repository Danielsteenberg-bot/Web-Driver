#ifndef DRIVE_H
#define DRIVE_H

#include <Servo.h>
#include "settings.h"

#define LEFT_FORWARD = 1700
#define RIGHT_FORWARD = 1300

#define HALF_LEFT_BACKWARD = 1600
#define HALF_RIGHT_BACKWARD = 1400

#define LEFT_BACKWARD = 1300
#define RIGHT_BACKWARD = 1700

#define HALF_LEFT_BACKWARD = 1400
#define HALF_RIGHT_BACKWARD = 1600

#define LEFT_STILL = 1500
#define RIGHT_STILL = 1500

void drive() {
    long now = millis();

    bool left = now - left_time <= DRIVE_ACTION_DURATION;
    bool right = now - right_time <= DRIVE_ACTION_DURATION;

    bool backward = now - forward_time <= DRIVE_ACTION_DURATION;
    bool forward = now - backward_time <= DRIVE_ACTION_DURATION;

    if (backward && forward) {
        left_motor.writeMicroseconds(LEFT_STILL);
        right_motor.writeMicroseconds(RIGHT_STILL);
        return
    } 

    if (left && right) {
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD);
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD);
    }
    
    if (left) {
        if (!backward && !forward) {
            left_motor.writeMicroseconds(LEFT_BACKWARD);
            right_motor.writeMicroseconds(RIGHT_FORWARD);
            return;
        }   
        
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD);
        right_motor.writeMicroseconds(RIGHT_STILL);
        return
    } 

    if (right) {
        if (!backward && !forward) {
            left_motor.writeMicroseconds(LEFT_FORWARD);
            right_motor.writeMicroseconds(RIGHT_BACKWARD);
            return;
        }   
        
        left_motor.writeMicroseconds(LEFT_STILL);
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD );
        return
    } 

    left_motor.writeMicroseconds(LEFT_STILL);
    right_motor.writeMicroseconds(RIGHT_STILL);
}

extern long left_time;
extern long right_time;
extern long forward_time;
extern long backward_time;

extern Servo left_motor;
extern Servo right_motor;

#endif