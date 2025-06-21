package home

import (
	"encoding/json"
	"lze-web/model/home/widget"
	"lze-web/pkg/global"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v3/disk"
)

func Widget(c *gin.Context) {
	var rec widget.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var files widget.Send
	docList := getFileList(global.DocPath, 3)
	picLIst := getFileList(global.PicPath, 1)
	notList := getFileList(global.NotPath, 3)
	bokList := getFileList(global.BokPath, 1)
	traList := getFileList(global.TraPath, 1)
	files.Doc1 = docList[0]
	files.Doc2 = docList[1]
	files.Doc3 = docList[2]
	files.Not1 = notList[0]
	files.Not2 = notList[1]
	files.Not3 = notList[2]
	files.Bok1 = bokList[0]
	files.Pic1 = picLIst[0]
	files.Tra1 = traList[0]
	files.Mon1, files.Mon2, files.Mon3 = monData(rec.User)
	files.Total, files.Used = diskData()
	c.JSON(200, files)
}

func getFileList(path string, count int) []string {
	fileList := global.ScanDir(path)
	length := len(fileList)
	result := make([]string, 0, count)
	if length >= count {
		for i := 0; i < count; i++ {
			result = append(result, fileList[i].Name)
		}
	} else {
		for i := 0; i < length; i++ {
			result = append(result, fileList[i].Name)
		}
		for i := length; i < count; i++ {
			result = append(result, "")
		}
	}
	return result
}
func monData(username string) (string, int, int) {
	var tokenTime string
	username = global.SetUsername(username)
	userData := global.UserConfig["user"].(map[string]interface{})
	if username == "visitor" {
		tokenTime = "0"
	} else {
		tokenTime = userData[username].(map[string]interface{})["tokentime"].(string)
	}
	avaTime := global.CheckTokenTime(username)
	controlDataMap := global.UserConfig["control"].(map[string]interface{})
	controlJson, err := json.Marshal(controlDataMap)
	if err != nil {
		panic(err)
	}
	controlData := string(controlJson)
	return tokenTime, avaTime, strings.Count(controlData, username)
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
