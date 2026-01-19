package system

import (
	"fmt"
	"lze-web/model/public/response"
	sys "lze-web/model/system/system"
	"math"
	"runtime"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"
)

func System(c *gin.Context) {
	var resData response.Response[sys.Send]
	var sendData sys.Send
	sendData.CpuPercent = cpuData()
	sendData.MemData, sendData.MemPercent = memData()
	sendData.DiskData, sendData.DiskPercent = diskData()
	sendData.NetUp, sendData.NetDown = netData()
	resData.Code = 200
	resData.Data = sendData
	c.JSON(resData.Code, resData)
}
func cpuData() string {
	cpuUsage, err := cpu.Percent(time.Millisecond*100, false)
	if err != nil {
		panic(err)
	}
	percent := int(math.Round(cpuUsage[0]*100) / 100)
	return strconv.Itoa(percent) + "%"
}
func memData() (string, string) {
	mem, err := mem.VirtualMemory()
	if err != nil {
		panic(err)
	}
	total := mem.Total / 1024 / 1024
	used := mem.Used / 1024 / 1024

	data := strconv.FormatUint(used, 10) + "MB/" +
		strconv.FormatUint(total, 10) + "MB"

	percent := int(float64(mem.Used) / float64(mem.Total) * 100)
	return data, strconv.Itoa(percent) + "%"
}

func diskData() (string, string) {
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
	total := usage.Total / 1024 / 1024 / 1024
	used := usage.Used / 1024 / 1024 / 1024

	data := strconv.FormatUint(used, 10) + "GB/" +
		strconv.FormatUint(total, 10) + "GB"

	percent := int(float64(usage.Used) / float64(usage.Total) * 100)
	return data, strconv.Itoa(percent) + "%"
}

func netData() (string, string) {
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
		sentMB := math.Round(float64(bytesSent)/1024/1024*100) / 100
		recvMB := math.Round(float64(bytesRecv)/1024/1024*100) / 100
		return fmt.Sprintf("%.2fMB", sentMB), fmt.Sprintf("%.2fMB", recvMB)
	}

	return "0.00MB", "0.00MB"
}
