package main

import (
	"fmt"
	"net"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var (
	ssidRegex = regexp.MustCompile(`(?m)SSID \d+ : (.+)\n`)
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
	if len(os.Args) < 2 {

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

		device, _ := strings.CutPrefix(ssid, "web-driver-")
		id, _ := strconv.Atoi(device)
		ArduinoConnectAccessPoint(id)

	} else if os.Args[1] == "server" {

		server, err := net.Listen("tcp", ":8888")

		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		defer server.Close()

		fmt.Println("Listening on", server.Addr())

		go func() {
			for {
				conn, err := server.Accept()

				if err != nil {
					fmt.Println(err)
					continue
				}

				go ArduinoHandleClient(conn)
			}
		}()
	}

	select {}
}
