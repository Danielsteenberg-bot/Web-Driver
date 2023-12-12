package main

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"proxy-client/sic"
	"regexp"
	"strings"
	"time"
)

var (
	ssidRegex = regexp.MustCompile(`(?m)SSID \d+ : (.+)\n`)
	comma     = []byte(",")
)

func findNetworks() []string {
	fmt.Println("[WIFI] scanning for wifi networks...")

	scan := exec.Command("netsh", "wlan", "show", "networks")
	output, err := scan.Output()

	if err != nil {
		fmt.Println("[WIFI] [ERROR] scanning wifi networks:", err)
		return nil
	}

	var ssids []string

	matches := ssidRegex.FindAllStringSubmatch(string(output), -1)

	for _, match := range matches {
		ssids = append(ssids, match[1][:len(match[1])-1])
	}

	return ssids
}

func connectNetwork(ssid string) bool {
	connect := exec.Command("netsh", "wlan", "connect", ssid)

	_, err := connect.Output()

	if err != nil {
		fmt.Println("[WIFI] [ERROR] connecting to wifi:", err)
		return false
	}

	fmt.Println("[WIFI] connected to wifi network:", ssid)
	return true
}

func main() {
	socket := sic.New()
	arduino := &Arduino{}

	socket.On("move", func(payload ...[]byte) {

		if len(payload) == 0 {
			return
		}

		fmt.Println("socket >", string(payload[0]))

		var direction string

		fmt.Println(string(payload[0]))

		switch string(payload[0]) {
		case "up":
			direction = "F"
		case "down":
			direction = "B"
		case "left":
			direction = "L"
		case "right":
			direction = "R"
		}

		err := arduino.Write([]byte("1" + direction + "\n"))

		if err != nil {
			fmt.Println("[ARDUINO] [WRITE] [ERR]", err)
		}
	})

	socket.On("joined-message", func(payload ...[]byte) {
		fmt.Println("joined-message", string(bytes.Join(payload, []byte(","))))
	})

	err := socket.Connect("ws://localhost:3000/socket.io", func() {
		fmt.Println("[WS] connected")

		socket.Emit("join-room-device", []byte("{\"deviceId\":\"1\",\"pass\":\"test\"}"))
	})

	if err != nil {
		fmt.Println("[WS] [ERROR]", err)
	}

	networks := findNetworks()

	var ssid string

	for _, network := range networks {
		if strings.Index(network, "web-driver-") != 0 {
			continue
		}

		ssid = network
		break
	}

	if ssid == "" {
		fmt.Println("[WIFI] no web-driver found")
		os.Exit(0)
	}

	fmt.Printf("[WIFI] network found: %s\n", ssid)

	if !connectNetwork(ssid) {
		os.Exit(0)
	}

	time.Sleep(1 * time.Second)

	arduino.Connect(func(message []byte) {

		if len(message) < 1 {
			return
		}

		fmt.Println("arduino >", string(message))

		switch ArduinoMessageType(message[0] - '0') {
		case GPS:
			socket.Emit("gps", bytes.Split(message[1:], comma)...)
		case SONAR:
			socket.Emit("sonar", bytes.Split(message[1:], comma)...)
		case ROTATION:
			socket.Emit("rotation", bytes.Split(message[1:], comma)...)
		}
	})

	select {}
}
