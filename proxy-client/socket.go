package main

import (
	"bytes"
	"fmt"
	"proxy-client/sic"
)

func CreateDeviceSocket(arduino *Arduino, id int) *sic.Socket {
	socket := sic.New()

	socket.On("move", func(payload ...[]byte) {
		if len(payload) == 0 {
			return
		}

		if arduino.Connection == nil {
			return
		}

		if err := arduino.Write([]byte("1" + string(payload[0]) + "\n")); err != nil {
			fmt.Println("[ARDUINO] write error:", err)
		}
	})

	socket.On("joined-message", func(payload ...[]byte) {
		fmt.Println("[JOIN MESSAGE]", string(bytes.Join(payload, []byte(","))))
	})

	err := socket.Connect("ws://localhost:3000/socket.io", func() {
		fmt.Println("[WS] connected")

		socket.Emit("join-room-device", []byte(fmt.Sprintf("{\"deviceId\":\"%d\",\"pass\":\"test\"}", id)))
	})

	if err != nil {
		fmt.Println("[WS] [ERROR]", err)
	}

	return socket
}
