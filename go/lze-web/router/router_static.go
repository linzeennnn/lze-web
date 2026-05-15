package router

import (
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func RouterStatic(r *gin.Engine) {
	r.Static("/file", global.FilePath)
	webRoot := filepath.Join(global.WorkDir, "web")

	// 或者针对根目录下可能存在的静态资源进行单独处理
	r.StaticFile("/favicon.ico", filepath.Join(webRoot, "favicon.ico"))
}
