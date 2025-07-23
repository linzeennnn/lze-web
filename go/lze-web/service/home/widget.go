package home

import (
	"encoding/json"
	"lze-web/model/home/widget"
	"lze-web/pkg/global"
	"strconv"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
)

func Widget(c *gin.Context) {
	var rec widget.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var files widget.Send
	var picList [1]widget.PicMes
	docList := getFileList(global.DocPath, 3, false, false)
	picName := getFileList(global.PicPath, 1, true, false)
	picList[0].Name = picName[0]
	picList[0].Media = CheckType(picName[0])
	notList := getFileList(global.NotPath, 3, true, true)
	bokList := getFileList(global.BokPath, 1, true, true)
	traList := getFileList(global.TraPath, 1, false, false)
	files.Doc = docList
	files.Not = notList
	files.Bok = bokList
	files.Pic = picList
	files.Tra = traList
	files.Mon = monData(rec.User)
	c.JSON(200, files)
}

func getFileList(path string, count int, ignoreDir bool, removeExt bool) []string {
	fileList := global.ScanDir(path)
	result := make([]string, 0, count)

	for _, f := range fileList {
		if ignoreDir && (f.FileType == "dir" || f.FileType == "dir_link") {
			continue
		}
		if removeExt {
			result = append(result, global.SplitExt(f.Name))
		} else {
			result = append(result, f.Name)
		}
		if len(result) >= count {
			break
		}
	}

	// 补足空位
	for len(result) < count {
		result = append(result, "")
	}

	return result
}

func monData(username string) [3]string {
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
	var monMes [3]string
	var avaTimeStr string
	if tokenTime == "never" {
		tokenTime = "永不过期"
		avaTimeStr = "永久"
	} else {
		tokenTime = convTokenTime(tokenTime)
		if avaTime < 0 {
			avaTimeStr = "过期"
		} else if avaTime < 24 && avaTime > 0 {
			avaTimeStr = strconv.Itoa(avaTime) + "小时"
		} else if avaTime < 24*30 {
			avaTimeStr = strconv.Itoa(avaTime/24) + "天"
		} else if avaTime < 24*30*12 {
			avaTimeStr = strconv.Itoa(avaTime/24/30) + "月"
		} else {
			avaTimeStr = strconv.Itoa(avaTime/24/365) + "年"
		}
	}
	monMes[0] = "登录时间:" + tokenTime
	monMes[1] = "剩余时间:" + avaTimeStr
	monMes[2] = "权限数量:" + strconv.Itoa(strings.Count(controlData, username))
	return monMes
}
func convTokenTime(input string) string {
	if input == "" || input == "0" {
		return "无"
	}
	var numStr strings.Builder
	var unitStr strings.Builder
	for _, r := range input {
		if unicode.IsDigit(r) {
			numStr.WriteRune(r)
		} else {
			unitStr.WriteRune(unicode.ToLower(r))
		}
	}
	num := numStr.String()
	unit := unitStr.String()
	unitMap := map[string]string{
		"d": "天",
		"h": "小时",
		"m": "月",
		"y": "年",
	}
	chineseUnit, ok := unitMap[unit]
	if !ok {
		chineseUnit = "未知单位" // fallback
	}

	return num + chineseUnit
}
func CheckType(name string) string {
	var imgFor = []string{".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg", ".ico", ".apng", ".avif"}
	if global.IncludeExt(name, imgFor) {
		return "img"
	}
	var vidFor = []string{".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v", ".avi", ".3gp", ".mkv"}
	if global.IncludeExt(name, vidFor) {
		return "vid"
	}
	return ""
}
