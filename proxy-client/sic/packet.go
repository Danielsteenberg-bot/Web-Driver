package sic

import (
	"fmt"
	"strconv"
)

type Packet struct {
	Type      Type
	Namespace string
	Payload   []byte
	AckId     *int
}

func (p *Packet) String() string {
	return fmt.Sprintf("type: %d namespace: %s, payload: %s", p.Type, p.Namespace, p.Payload)
}

func encode(p *Packet) []byte {
	str := ""

	str += string(rune(p.Type + '0'))

	if len(p.Namespace) != 0 && p.Namespace != "/" {
		str += p.Namespace
	}

	if p.AckId != nil {
		str += strconv.Itoa(*p.AckId)
	}

	str += string(p.Payload)

	return []byte(str)
}

func decode(buffer []byte) *Packet {
	length := len(buffer)

	if length == 0 {
		return nil
	}

	p := &Packet{
		Type:      Type(buffer[0] - '0'),
		Namespace: "/",
	}

	if length < 2 {
		return p
	}

	end := 1

	if buffer[1] == '/' {
		for i, char := range buffer[1:] {
			if char == ',' {
				end = i
				break
			}
			p.Namespace += string(char)
		}
	}

	p.Payload = buffer[end:length]

	return p
}
