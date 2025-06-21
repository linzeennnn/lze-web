package sys

type Send struct {
	CPUUsage    float64 `json:"cpuUsage"`
	TotalMemory uint64  `json:"totalMemory"`
	UsedMemory  uint64  `json:"usedMemory"`
	TotalDisk   uint64  `json:"totalDisk"`
	UsedDisk    uint64  `json:"usedDisk"`
	NetworkRx   float64 `json:"networkRx"`
	NetworkTx   float64 `json:"networkTx"`
}
