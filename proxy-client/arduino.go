package main

import (
	"bufio"
	"fmt"
	"net"
	"time"
)

type ArduinoMessageType uint8

type Arduino struct {
	Connection *net.Conn
}

const (
	GPS ArduinoMessageType = iota + 1
	ROTATION
	SONAR
)

const (
	DRIVE_ACTION = iota + 1
)

func (a *Arduino) Write(buffer []byte) {

	if a.Connection == nil {
		return
	}

	conn := *a.Connection
	_, err := conn.Write(buffer)
	fmt.Println(err)
}

func (a *Arduino) Connect(handler func([]byte)) {
	c, err := net.Dial("tcp", "192.168.8.8:80")

	if err != nil {
		fmt.Println("[WIFI] [ERROR] dialing tpc:", err)
		return
	}

	a.Connection = &c

	reconnect := func() {
		c.Close()

		for {
			c, err := net.Dial("tcp", "192.168.8.8:80")

			if err == nil {
				a.Connection = &c
				return
			}

			time.Sleep(500 * time.Millisecond)
		}
	}

	// Create a buffer reader to read data from the connection
	reader := bufio.NewReader(c)

	go func() {
		for {
			line, err := reader.ReadSlice('\n')

			if err != nil {
				reconnect()
				continue
			}

			handler(line[:len(line)-1])
		}

	}()
}
