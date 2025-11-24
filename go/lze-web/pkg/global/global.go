package global

import (
	"lze-web/model/config"

	"github.com/golang-jwt/jwt/v5"
)

var (
	UserConfig    map[string]interface{} //用户配置
	UserList      []string               //用户列表
	Port          string                 //服务监听端口
	MaxUploadSize int64                  //最大上传大小
	Gzip          string                 //是否启用gzip压缩
	Lang          map[string]interface{} //语言
	JwtKey        []byte                 //jwt密钥
	UserArr       []config.UserMes
	// 路径相关
	WorkDir  string
	DocPath  string
	PicPath  string
	NotPath  string
	BokPath  string
	TraPath  string
	TempPath string
	FilePath string
	LogPath  string
	CmdPath  string
	// 其他
	FileLinkArr [10]FileLink
	DirLinkArr  [10]DirLink
)

type Claims struct {
	Name string `json:"name"`
	Jti  string `json:"jti"`
	Exp  int64  `json:"exp"`
	jwt.RegisteredClaims
}
type FileLink struct {
	Path  string
	Token string
	Time  int64
}
type DirLink struct {
	Path  string
	Token string
	Time  int64
}
