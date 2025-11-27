package home

import (
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
	picTmpData := picData()
	picList[0].Name = picTmpData[0]
	picList[0].Media = picTmpData[1]
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
func picData() [2]string {
	fileList := global.ScanDir(global.PicPath)
	result := [2]string{"", ""}

	for _, f := range fileList {
		media := CheckType(f.Name)
		if f.FileType == "dir" || f.FileType == "dir_link" || media == "" {
			continue
		}
		result[0] = f.Name
		result[1] = media
		return result
	}
	return result
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
func monData(username string) [3]string {
	var tokenTime string
	username = global.SetUsername(username)
	userData := global.GetUserMes(username)
	if userData.Name == "guest" {
		tokenTime = "0"
	} else {
		tokenTime = userData.Outdate
	}
	avaTime := global.GetRemainTime(username)
	controlDataMap := global.UserConfig["control"].(map[string]interface{})
	var monMes [3]string
	var avaTimeStr string
	if tokenTime == "never" {
		avaTimeStr = "never"
	} else {
		tokenTime = convTokenTime(tokenTime)
		if avaTime < 24 {
			avaTimeStr = strconv.FormatInt(avaTime, 10) + "/hour"
		} else if avaTime < 24*30 {
			avaTimeStr = strconv.FormatInt(avaTime/24, 10) + "/day"
		} else if avaTime < 24*30*12 {
			avaTimeStr = strconv.FormatInt(avaTime/(24*30), 10) + "/month"
		} else {
			avaTimeStr = strconv.FormatInt(avaTime/(24*30*12), 10) + "/year"
		}
	}
	monMes[0] = "login_time" + "/" + tokenTime
	monMes[1] = "remain_time" + "/" + avaTimeStr
	monMes[2] = "per_num" + "/" + countActNum(userData.Name, controlDataMap)
	return monMes
}
func countActNum(username string, data map[string]interface{}) string {
	count := 0
	count += countInMap(username, data)
	return strconv.Itoa(count)
}
func countInMap(username string, m map[string]interface{}) int {
	count := 0
	for key, value := range m {
		switch v := value.(type) {
		case map[string]interface{}:
			count += countInMap(username, v)
		case []interface{}:
			if key == "user" {
				for _, item := range v {
					if str, ok := item.(string); ok && str == username {
						count++
					}
				}
			} else {
				for _, item := range v {
					if subMap, ok := item.(map[string]interface{}); ok {
						count += countInMap(username, subMap)
					}
				}
			}
		}
	}
	return count
}

func convTokenTime(input string) string {
	if input == "" || input == "0" {
		return "none"
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
		"d": "/day",
		"h": "/hour",
		"m": "/month",
		"y": "/year",
	}
	chineseUnit, ok := unitMap[unit]
	if !ok {
		chineseUnit = "unknow" // fallback
	}

	return num + chineseUnit
}
