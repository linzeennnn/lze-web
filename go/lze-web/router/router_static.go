package router

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func RouterStatic(r *gin.Engine) {
	webRoot := filepath.Join(global.WorkDir, "web")

	// 挂载 /file 静态目录（单独处理）
	r.Static("/file", global.FilePath)

	// 根路径的文件访问用 NoRoute 来做智能路由处理
	r.NoRoute(func(c *gin.Context) {
		reqPath := c.Request.URL.Path

		// 防止目录穿越攻击
		if !strings.HasPrefix(reqPath, "/") {
			c.String(http.StatusForbidden, "Forbidden")
			return
		}

		// 路由重写映射
		routeMap := map[string]string{
			"/doc": "/doc.html",
			"/pic": "/pic.html",
			"/tra": "/tra.html",
			"/mon": "/mon.html",
			"/not": "/not.html",
			"/bok": "/bok.html",
		}

		if htmlPath, ok := routeMap[reqPath]; ok {
			reqPath = htmlPath
		}

		// 拼接本地文件路径
		file := filepath.Join(webRoot, reqPath)

		// 确保 file 在 webRoot 目录内
		absFile, err1 := filepath.Abs(file)
		absRoot, err2 := filepath.Abs(webRoot)
		if err1 != nil || err2 != nil || !strings.HasPrefix(absFile, absRoot) {
			c.String(http.StatusForbidden, "Forbidden")
			return
		}

		// 判断文件是否存在且是文件
		info, err := os.Stat(absFile)
		if err == nil && !info.IsDir() {
			c.File(absFile)
			return
		}

		// 其他情况返回 index.html
		c.File(filepath.Join(webRoot, "index.html"))
	})
}
