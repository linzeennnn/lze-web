package system

import (
	sys "lze-web/model/system/system"
	"math"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
)

func System(c *gin.Context) {
	var sendData sys.Send
	sendData.CPUUsage = cpuData()
	sendData.TotalMemory, sendData.UsedMemory = memData()
	sendData.TotalDisk, sendData.UsedDisk = diskData()
	sendData.NetworkTx, sendData.NetworkRx = netData()
	c.JSON(200, sendData)
}
func cpuData() float64 {
	cpuUsage, err := cpu.Percent(time.Millisecond*100, false)
	if err != nil {
		panic(err)
	}
	return math.Round(cpuUsage[0]*100) / 100
}
func memData() (uint64, uint64) {
	mem, err := mem.VirtualMemory()
	if err != nil {
		panic(err)
	}
	return mem.Total / 1024 / 1024, mem.Used / 1024 / 1024
}
func diskData() (uint64, uint64) {
	var diskPath string
	if runtime.GOOS == "windows" {
		diskPath = `C:\`
	} else {
		diskPath = "/"
	}
	usage, err := disk.Usage(diskPath)
	if err != nil {
		panic(err)
	}
	return usage.Total / 1024, usage.Used / 1024
}
func netData() (float64, float64) {
	io1, err := net.IOCounters(false)
	if err != nil {
		panic(err)
	}

	time.Sleep(time.Second) // 休眠1秒

	io2, err := net.IOCounters(false)
	if err != nil {
		panic(err)
	}

	if len(io1) > 0 && len(io2) > 0 {
		bytesSent := io2[0].BytesSent - io1[0].BytesSent
		bytesRecv := io2[0].BytesRecv - io1[0].BytesRecv
		return math.Round(float64(bytesSent)/1024*100) / 100, math.Round(float64(bytesRecv)/1024*100) / 100
	}
	return 0, 0
}
