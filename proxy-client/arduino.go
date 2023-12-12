package main

import (
	"bufio"
	"bytes"
	"fmt"
	"net"
	"proxy-client/sic"
	"strconv"
	"sync"
	"time"
)

type ArduinoMessageType uint8

type Arduino struct {
	Id         int
	Connection net.Conn
	Socket     *sic.Socket
	LastPing   int64
	LastPong   int64
}

const (
	CONNECT ArduinoMessageType = iota
	GPS
	ROTATION
	SONAR
	VELOCITY
	PING ArduinoMessageType = iota + 3
	PONG
)

var (
	clients      = map[int]*Arduino{}
	clientsMutex sync.Mutex
	comma        = []byte(",")
)

func (a *Arduino) Write(buffer []byte) error {
	if a.Connection == nil {
		return net.ErrClosed
	}

	_, err := a.Connection.Write(buffer)
	return err
}

func ArduinoConnectAccessPoint(id int) {
	connection, err := net.Dial("tcp", "192.168.8.8:80")
	c := &Arduino{Id: id, Connection: connection}
	c.Socket = CreateDeviceSocket(c, id)

	if err != nil {
		fmt.Println("[WIFI] [ERROR] dialing tpc:", err)
		return
	}

	reader := bufio.NewReader(c.Connection)

	reconnect := func() {
		c.Connection.Close()
		start := time.Now().UnixMilli()
		c.Connection = nil

		time.Sleep(5 * time.Second)

		var err error

		fmt.Printf("[ARDUINO] [%d] reconnecting\n", id)

		defer func() {
			fmt.Printf("[ARDUINO] [%d] reconnected in %ds\n", id, (time.Now().UnixMilli()-start)/1000)
		}()

		for {

			c.Connection, err = net.DialTimeout("tcp", "192.168.8.8:80", 3*time.Second)

			if err == nil {
				reader = bufio.NewReader(c.Connection)
				return
			}
		}
	}

	for {
		line, err := reader.ReadSlice('\n')

		if err != nil {
			reconnect()
			continue
		}

		c.MessageHandler(line[:len(line)-1])

		if time.Now().UnixMilli()-c.LastPing > 5000 && c.Connection != nil {
			fmt.Printf("[ARDUINO] [%d] sending ping\n", id)
			c.LastPing = time.Now().UnixMilli()
			if _, err := c.Connection.Write([]byte{byte(PING + '0'), '\n'}); err != nil {
				reconnect()
			}
		}
	}
}

func ArduinoHandleClient(connection net.Conn) {
	reader := bufio.NewReader(connection)

	var (
		c      *Arduino
		socket *sic.Socket
		id     int
	)

	defer func() {
		c.Connection = nil
	}()

	for {
		line, err := reader.ReadSlice('\n')

		if err != nil {
			return
		}

		message := line[:len(line)-1]

		if id == 0 && ArduinoMessageType(message[0]-'0') == CONNECT {
			id, _ = strconv.Atoi(string(message[1:]))
			fmt.Printf("[ARDUINO] connection from device %d\n", id)

			clientsMutex.Lock()

			ok := false
			c, ok = clients[id]

			if !ok {
				c = &Arduino{Connection: connection, Id: id}
				socket = CreateDeviceSocket(c, id)
				c.Socket = socket
				clients[id] = c

			} else {
				c.Connection = connection
			}

			clientsMutex.Unlock()
			continue

		} else if id != 0 {
			c.MessageHandler(message)

			if time.Now().UnixMilli()-c.LastPing > 5000 {
				fmt.Printf("[ARDUINO] [%d] sending ping\n", id)
				c.LastPing = time.Now().UnixMilli()
				if _, err := connection.Write([]byte{byte(PING + '0'), '\n'}); err != nil {
					fmt.Printf("[ARDUINO] [%d] error sending ping %f err \n", id, err)
					return
				}
			}
		}
	}
}

func (c *Arduino) MessageHandler(message []byte) {

	if len(message) < 1 {
		return
	}

	switch ArduinoMessageType(message[0] - '0') {
	case GPS:
		c.Socket.Emit("gps", bytes.Split(message[1:], comma)...)
	case SONAR:
		c.Socket.Emit("sonar", bytes.Split(message[1:], comma)...)
	case ROTATION:
		c.Socket.Emit("rotation", bytes.Split(message[1:], comma)...)
	case VELOCITY:
		// fmt.Println(string(message[1:]))
		// socket.Emit("velocity", bytes.Split(message[1:], comma)...)
	case PONG:
		c.LastPong = time.Now().UnixMilli()
		fmt.Printf("[ARDUINO] [%d] recieved pong in %dms\n", c.Id, c.LastPong-c.LastPing)
	}
}
