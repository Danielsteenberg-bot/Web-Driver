package main

import (
	"fmt"
	"os/exec"
)

func main() {
	// Scan for available WiFi networks
	fmt.Println("Scanning for WiFi networks...")
	scan := exec.Command("netsh", "wlan", "show", "networks")
	output, err := scan.Output()
	if err != nil {
		fmt.Println("Error scanning WiFi networks:", err)
		return
	}

	fmt.Println(string(output))
}
