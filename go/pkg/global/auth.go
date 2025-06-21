package global

import (
	"strconv"
	"strings"
	"time"
)

// 计算剩余登陆时间
func CheckTokenTime(username string) int {
	username = SetUsername(username)
	if username == "vistor" {
		return 0
	}
	userModule := UserConfig["user"].(map[string]interface{})
	userMes := userModule[username].(map[string]interface{})
	token := userMes["token"].(string)
	tokentime := userMes["tokentime"].(string)
	if token == "" || tokentime == "" || tokentime == "never" {
		return 0
	}
	startStr := strings.Split(token, "_")[1]
	startTime, err := strconv.Atoi(startStr)
	if err != nil {
		return 0
	}
	unit := tokentime[len(tokentime)-1:]
	avaTimeStr := tokentime[:len(tokentime)-1]
	avaTime, err := strconv.Atoi(avaTimeStr)
	if err != nil {
		return 0
	}
	switch unit {
	case "y":
		avaTime = avaTime * 24 * 365
	case "m":
		avaTime = avaTime * 24 * 30
	case "d":
		avaTime = avaTime * 24
	}
	now := GetTimeStamp()
	return avaTime - int(now-int64(startTime))

}

// 检查token
func CheckToken(username, token string) bool {
	username = SetUsername(username)
	if username == "vistor" {
		return true
	}
	userModule := UserConfig["user"].(map[string]interface{})
	userMes := userModule[username].(map[string]interface{})
	saveToken := userMes["token"].(string)
	if saveToken != token {
		return false
	}
	if CheckTokenTime(username) < 0 {
		return false
	}
	return true
}

// 设置用户名
func SetUsername(username string) string {
	isUser := false
	for _, user := range UserList {
		if user == username {
			isUser = true
			break
		}
	}
	if !isUser {
		return "vistor"
	}
	return username

}

// 获取时间戳
func GetTimeStamp() int64 {
	return time.Now().Unix() / 3600
}
