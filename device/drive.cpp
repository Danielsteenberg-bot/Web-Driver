#include "drive.h"    

void drive() {
    long now = millis();

    bool left = now - left_time <= DRIVE_ACTION_DURATION;
    bool right = now - right_time <= DRIVE_ACTION_DURATION;

    bool forward = now - forward_time <= DRIVE_ACTION_DURATION;
    bool backward = now - backward_time <= DRIVE_ACTION_DURATION;

    if (backward && forward) {
        left_motor.writeMicroseconds(LEFT_STILL);
        right_motor.writeMicroseconds(RIGHT_STILL);
        return;
    } 

    if (left && right) {
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD);
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD);
        return;
    }
    
    if (left) {
        if (!backward && !forward) {
            left_motor.writeMicroseconds(LEFT_BACKWARD);
            right_motor.writeMicroseconds(RIGHT_FORWARD);
            return;
        }   
        
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD);
        right_motor.writeMicroseconds(RIGHT_STILL);
        return;
    } 

    if (right) {
        if (!backward && !forward) {
            left_motor.writeMicroseconds(LEFT_FORWARD);
            right_motor.writeMicroseconds(RIGHT_BACKWARD);
            return;
        }   
        
        left_motor.writeMicroseconds(LEFT_STILL);
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD );
        return;
    } 

    if (forward || backward) {
        Serial.println("driving");
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD );
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD );
        return;
    }

    left_motor.writeMicroseconds(LEFT_STILL);
    right_motor.writeMicroseconds(RIGHT_STILL);
}
