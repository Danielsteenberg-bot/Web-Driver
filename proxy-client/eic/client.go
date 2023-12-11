package eic

import (
	"fmt"
	"time"

	"github.com/gorilla/websocket"
)

const SEPARATOR = '\x1e'

type Type = int8

const (
	OPEN    = iota // Used during the handshake.
	CLOSE          // Used to indicate that a transport can be closed.
	PING           // Used in the heartbeat mechanism.
	PONG           // Used in the heartbeat mechanism.
	MESSAGE        // Used to send a payload to the other side.
	UPGRADE        // Used during the upgrade process.
	NOOP           // Used during the upgrade process.
)

type Client struct {
	Connection *websocket.Conn
	Messages   chan []byte
}

func (c *Client) Send(t Type, payload []byte) {
	payload = append([]byte{byte(t + '0')}, payload...)
	c.Connection.WriteMessage(websocket.TextMessage, payload)
}

func Connect(address string) (*Client, error) {
	c, _, err := websocket.DefaultDialer.Dial(address+"/?EIO=4&transport=websocket", nil)

	if err != nil {
		return nil, err
	}

	client := &Client{Connection: c, Messages: make(chan []byte)}

	if err != nil {
		fmt.Println("[EIC] [ERROR]", err)
	}

	reconnect := func() {
		c.Close()

		for {
			c, _, err := websocket.DefaultDialer.Dial(address+"/?EIO=4&transport=websocket", nil)

			if err == nil {
				client.Connection = c
				client.Send(MESSAGE, []byte("0"))
				return
			}

			time.Sleep(500 * time.Millisecond)
		}
	}

	go func() {
		for {
			t, buffer, err := client.Connection.ReadMessage()

			if err != nil {
				fmt.Println("[EIC] [ERROR]", err)
				reconnect()
				continue
			}

			if t == websocket.TextMessage {
				t := Type(buffer[0] - '0')

				switch t {

				case PING:
					client.Send(PONG, nil)

				case MESSAGE:
					client.Messages <- buffer[1:]
				}
			}
		}
	}()

	client.Send(MESSAGE, []byte("0"))

	return client, nil
}
