package global

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"lze-web/model/config"
	"math/rand"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/pbkdf2"
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
	if curUserMes.Name == "guest" {
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
		return "guest"
	}
	return username

}

// 获取时间戳(小时)
func GetTimeStamp() int64 {
	return time.Now().Unix() / 3600
}

// 获取时间戳(秒)
func GetTimeStampS() int64 {
	return time.Now().Unix()
}

// 检查操作权限
func CheckPermit(c *gin.Context, control, action string) bool {
	if !CheckToken(c) {
		return false
	}
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
	userMes := GetUserMes(name) //获取对应用户信息
	avaTime := userMes.Outdate  //获取token有效时间
	now := GetTimeStamp()
	var claims *Claims
	if now > userMes.Exp || userMes.Jti == "" {
		expTime := GetExpTime(avaTime) //获取过期时间
		jti := GenJti()
		claims = &Claims{
			Name: userMes.Name,
			Jti:  jti,
			Exp:  expTime,
		}
		userMes.Jti = jti
		userMes.Exp = expTime
		SaveUserConfig()
	} else {
		claims = &Claims{
			Name: userMes.Name,
			Jti:  userMes.Jti,
			Exp:  userMes.Exp,
		}
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
	for i := range UserArr { // 用 index 遍历
		if UserArr[i].Name == username {
			return &UserArr[i] // 返回真实元素地址！
		}
		if UserArr[i].Name == "guest" {
			guestMes = &UserArr[i]
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

// 计算剩余时间
func GetRemainTime(username string) int64 {
	now := GetTimeStamp()
	exp := GetUserMes(username).Exp
	remainTime := exp - now
	if remainTime < 0 {
		remainTime = 0
	}
	return remainTime
}

// ///////////写操作///////////////////
// 保存用户配置
func SaveUserConfig() {
	UserConfig["userMes"] = UserArr
	userJson, err := json.MarshalIndent(UserConfig, "", "  ")
	if err != nil {
		panic(err)
	}
	WriteText(filepath.Join(WorkDir, "config", "user_config.json"), string(userJson))

}

// 解析用户名密码加密字符串

func DecodeUserMes(encodedB64, password string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(encodedB64)
	if err != nil {
		return "", err
	}

	if len(data) < 16+12 {
		return "", fmt.Errorf("数据长度不足")
	}

	salt := data[:16]
	iv := data[16:28]
	ciphertext := data[28:]

	key := pbkdf2.Key([]byte(password), salt, 100000, 32, sha256.New)
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	plaintext, err := aesgcm.Open(nil, iv, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
