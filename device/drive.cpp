#include "drive.h"    

void turn_left() {
    left_motor.writeMicroseconds(LEFT_BACKWARD);
    right_motor.writeMicroseconds(RIGHT_FORWARD);
}

void turn_right() {
    left_motor.writeMicroseconds(LEFT_FORWARD);
    right_motor.writeMicroseconds(RIGHT_BACKWARD);
}

void drive_straight(bool backward) {
    left_motor.writeMicroseconds(backward ? LEFT_BACKWARD : LEFT_FORWARD);
    right_motor.writeMicroseconds(backward ? RIGHT_BACKWARD : RIGHT_FORWARD);
}

void still() {
    left_motor.writeMicroseconds(LEFT_STILL);
    right_motor.writeMicroseconds(RIGHT_STILL);
}

long left_switch;
bool left_turn;

void drive_left(bool backward) {
    if (millis() - left_switch > DRIVE_TO_SIDE_SWITCH_TIME) {
        left_switch = millis();
        left_turn = !left_turn;
    }

    if (left_turn) { turn_left(); } else { drive_straight(backward); };
}

long right_switch;
bool right_turn;

void drive_right(bool backward) {
    if (millis() - right_switch > DRIVE_TO_SIDE_SWITCH_TIME) {
        right_switch = millis();
        right_turn = !right_turn;
    }
    
    if (right_turn) { turn_right(); } else { drive_straight(backward); };
}

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
        still();

    } else if (left && right) {
        drive_straight(backward);

    } else if (left) {
        if (!backward && !forward) { turn_left(); } else { drive_left(backward); }   
    
    } else if (right) {
        if (!backward && !forward) { turn_right(); } else { drive_right(backward); }   
   
    } else if (forward || backward) {
        drive_straight(backward);
    
    } else {
        still();
    }
}

