package sys

type Send struct {
	CpuPercent  string `json:"cpuPercent"`
	MemPercent  string `json:"memPercent"`
	MemData     string `json:"memData"`
	DiskPercent string `json:"diskPercent"`
	DiskData    string `json:"diskData"`
	NetUp       string `json:"netUp"`
	NetDown     string `json:"netDown"`
}
