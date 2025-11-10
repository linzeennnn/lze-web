package global

var (
	UserConfig    map[string]interface{}
	UserList      []string
	Port          string
	MaxUploadSize int64
	Gzip          string
	Lang          map[string]interface{}
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
)
