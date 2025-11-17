package global

import (
	"encoding/json"
	"lze-web/model/config"
	"math/rand"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// 初始化当前用户信息
func InitUserMes(c *gin.Context) {
	// 从header提取token
	var token string
	authHeader := c.GetHeader("authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	} else {
		token = authHeader
	}
	// 解析token(jwt)
	curUserMes, _ := DecodeJwt(token)
	// 将当前用户信息赋值到context里
	c.Set("curUserMes", curUserMes)
}

// 检查token
func CheckToken(c *gin.Context) bool {
	curUserMes, _ := c.MustGet("curUserMes").(*Claims)
	if curUserMes.Name == "guest" && curUserMes.Jti == "" && curUserMes.Exp == 0 {
		return true
	}
	userMes := GetUserMes(curUserMes.Name)
	if userMes.Jti != curUserMes.Jti || userMes.Exp < curUserMes.Exp {
		return false
	}
	return true
}

// 检查密码
func CheckPassword(username, password string) (string, bool) {
	username = SetUsername(username)
	if username == "guest" {
		return "", false
	}
	userMes := GetUserMes(username)
	if password != userMes.Password {
		return "", false
	}
	now := GetTimeStamp()
	if now < userMes.Exp || userMes.Jti == "" {
		userMes.Jti = GenJti()
		userMes.Exp = now
		UserConfig["userMes"] = UserArr
		SaveUserConfig()
	}
	return GenJwt(username), true
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
func CheckPermit(c *gin.Context, control, action string) bool {
	curUserMes := c.MustGet("curUserMes").(*Claims)
	controlModule := UserConfig["control"].(map[string]interface{})
	controlMes := controlModule[control].(map[string]interface{})
	actionModule := controlMes["action"].(map[string]interface{})
	actionMes := actionModule[action].(map[string]interface{})
	userAction := actionMes["user"].([]interface{})
	for _, avaUser := range userAction {
		if avaUser == curUserMes.Name {
			return true
		}
	}
	return false
}

// 生成jwt
func GenJwt(name string) (token string) {
	userMes := GetUserMes(name)    //获取对应用户信息
	avaTime := userMes.Outdate     //获取token有效时间
	expTime := GetExpTime(avaTime) //获取过期时间
	claims := &Claims{
		Name: name,
		Jti:  GenJti(),
		Exp:  expTime,
	}
	token, _ = jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(JwtKey)
	return
}

// 解析jwt
func DecodeJwt(jwtStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(jwtStr, claims, func(token *jwt.Token) (interface{}, error) {
		// 校验签名算法是否正确（推荐做）
		if token.Method.Alg() != jwt.SigningMethodHS256.Alg() {
			return ErrClaim(), nil
		}
		return JwtKey, nil
	})

	if err != nil {
		return ErrClaim(), nil
	}

	if !token.Valid {
		return ErrClaim(), nil
	}

	return claims, nil
}

// 生成空Claim(表示错误的jwt)
func ErrClaim() *Claims {
	return &Claims{
		Name: "guest",
		Jti:  "",
		Exp:  0,
	}
}

// 生成jti
func GenJti() string {
	dict := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	var builder strings.Builder
	for i := 0; i < 32; i++ {
		index := rand.Intn(32)
		builder.WriteRune(dict[index])
	}
	return builder.String() + "_" + strconv.FormatInt(GetTimeStamp(), 10)

}

// 获取某个用户的配置信息
func GetUserMes(username string) *config.UserMes {
	var guestMes *config.UserMes
	for _, user := range UserArr {
		if user.Name == username {
			return &user
		}
		if user.Name == "guest" {
			guestMes = &user
		}
	}
	return guestMes
}

// 获取过期时间
func GetExpTime(avaTimeCon string) int64 {
	if avaTimeCon == "never" {
		return -1
	}
	unit := avaTimeCon[len(avaTimeCon)-1:]
	avaTimeStr := avaTimeCon[:len(avaTimeCon)-1]
	avaTime, _ := strconv.Atoi(avaTimeStr)
	switch unit {
	case "y":
		avaTime = avaTime * 24 * 365
	case "m":
		avaTime = avaTime * 24 * 30
	case "d":
		avaTime = avaTime * 24
	}
	return GetTimeStamp() + int64(avaTime)
}

// ///////////写操作///////////////////
// 保存用户配置
func SaveUserConfig() {
	userJson, err := json.MarshalIndent(UserConfig, "", "  ")
	if err != nil {
		panic(err)
	}
	WriteText(filepath.Join(WorkDir, "config", "user_config.json"), string(userJson))

}
