package global

import (
	"encoding/json"
	"math/rand"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// 计算剩余登陆时间
func CheckTokenTime(username string) int {
	username = SetUsername(username)
	if username == "visitor" {
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
	if username == "visitor" {
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

// 检查密码
func CheckPassword(username, password string) (string, bool) {
	username = SetUsername(username)
	if username == "visitor" {
		return "", true
	}
	userModule := UserConfig["user"].(map[string]interface{})
	userMes := userModule[username].(map[string]interface{})
	savePassword := userMes["password"].(string)
	if password != savePassword {
		return "", false
	}
	if CheckTokenTime(username) < 0 {
		token := GenToken()
		userMes["token"] = token
		SaveUserConfig()
		return token, true
	}
	saveToken := userMes["token"].(string)
	return saveToken, true
}

// 生成token
func GenToken() string {
	dict := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	var builder strings.Builder
	for i := 0; i < 32; i++ {
		index := rand.Intn(32)
		builder.WriteRune(dict[index])
	}
	return builder.String() + "_" + strconv.FormatInt(GetTimeStamp(), 10)
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
		return "visitor"
	}
	return username

}

// 获取时间戳
func GetTimeStamp() int64 {
	return time.Now().Unix() / 3600
}

// 检查操作权限
func CheckPermit(username, token, control, action string) bool {
	username = SetUsername(username)
	if !CheckToken(username, token) {
		return false
	}
	controlModule := UserConfig["control"].(map[string]interface{})
	controlMes := controlModule[control].(map[string]interface{})
	actionModule := controlMes["action"].(map[string]interface{})
	actionMes := actionModule[action].(map[string]interface{})
	userAction := actionMes["user"].([]interface{})
	for _, avaUser := range userAction {
		if avaUser == username {
			return true
		}
	}
	return false
}

// 保存用户配置
func SaveUserConfig() {
	userJson, err := json.MarshalIndent(UserConfig, "", "  ")
	if err != nil {
		panic(err)
	}
	WriteText(filepath.Join(WorkDir, "config", "user_config.json"), string(userJson))

}
