package sic

import (
	"bytes"
	"net"
	"proxy-client/eic"
)

type Type int8

const (
	CONNECT       Type = iota // Used during the connection to a namespace.
	DISCONNECT                // Used when disconnecting from a namespace.
	EVENT                     // Used to send data to the other side.
	ACK                       // Used to acknowledge an event.
	CONNECT_ERROR             // Used during the connection to a namespace.
	BINARY_EVENT              // Used to send binary data to the other side.
	BINARY_ACK                // Used to acknowledge an event (the response includes binary data).)
)

type Handler = func(payload ...[]byte)

type Socket struct {
	client *eic.Client
	events map[string][]Handler
}

func New() *Socket {
	return &Socket{events: make(map[string][]Handler)}
}

func (s *Socket) On(name string, handler Handler) {

	handlers, exists := s.events[name]

	if exists {
		handlers = append(handlers, handler)
	} else {
		handlers = []func(...[]byte){handler}
	}

	s.events[name] = handlers
}

func (s *Socket) Emit(name string, arguments ...[]byte) error {

	if s.client == nil {
		return net.ErrClosed
	}

	packet := &Packet{
		Type:      EVENT,
		Namespace: "/",
	}

	buffer := bytes.Buffer{}
	buffer.WriteString("[\"")
	buffer.WriteString(name)
	buffer.WriteRune('"')

	for _, argument := range arguments {
		buffer.WriteRune(',')
		buffer.Write(argument)
	}

	buffer.WriteRune(']')

	packet.Payload = buffer.Bytes()

	return s.client.Send(eic.MESSAGE, encode(packet))
}

func (s *Socket) Connect(address string, handler func()) error {
	client, err := eic.Connect(address)

	if err != nil {
		return err
	}

	s.client = client

	go func() {
		for {
			message := <-client.Messages
			packet := decode(message)

			if packet.Type == CONNECT {
				handler()
			}

			if packet.Type == EVENT {
				payload := packet.Payload[1 : len(packet.Payload)-1]
				data := make([][]byte, 0)

				for _, value := range bytes.Split(payload, []byte(",")) {
					lenght := len(value)

					if lenght > 1 && value[0] == '"' && value[lenght-1] == '"' {
						data = append(data, value[1:lenght-1])
					}
				}

				length := len(data)

				if length == 0 {
					continue
				}

				for _, handler := range s.events[string(data[0])] {
					go handler(data[1:]...)
				}
			}
		}
	}()

	return nil
}
