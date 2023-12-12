#include "drive.h"    

void drive() {
    long now = millis();

    bool left = now - left_time <= DRIVE_ACTION_DURATION;
    bool right = now - right_time <= DRIVE_ACTION_DURATION;

    bool forward = now - forward_time <= DRIVE_ACTION_DURATION;
    bool backward = now - backward_time <= DRIVE_ACTION_DURATION;

    COOLDOWN(1000, {
       char buffer[50];
        snprintf(buffer, sizeof(buffer), "f:%d b:%d l:%d r:%d", forward, backward, left, right);
        Serial.println(buffer);
    });

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
        
        left_motor.writeMicroseconds(backward ? LEFT_HALF_BACKWARD: LEFT_HALF_FORWARD);
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD ) ;
        return;
    } 

    if (right) {
        if (!backward && !forward) {
            left_motor.writeMicroseconds(LEFT_FORWARD);
            right_motor.writeMicroseconds(RIGHT_BACKWARD);
            return;
        }   
        
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD );
        right_motor.writeMicroseconds(backward ? RIGHT_HALF_BACKWARD : RIGHT_HALF_FORWARD );
        return;
    } 

    if (forward || backward) {
        left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD );
        right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD );
        return;
    }

    left_motor.writeMicroseconds(LEFT_STILL);
    right_motor.writeMicroseconds(RIGHT_STILL);
}
