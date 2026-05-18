package router

import (
	"fmt"
	"lze-web/pkg/global"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	r := gin.Default()

	switch global.Gzip {
	case "yes":
		r.Use(gzip.Gzip(gzip.DefaultCompression))
	case "no":
	default:
		fmt.Println("work_config.json: gzip(config error)")
		return nil
	}

	r.Use(cors.Default())

	r.Use(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, global.MaxUploadSize)
		c.Next()
	})

	RouterStatic(r)
	RouterLogin(r)
	RouterHome(r)
	RouterSystem(r)
	RouterBok(r)
	RouterNot(r)
	RouterMon(r)
	RouterPic(r)
	RouterDoc(r)
	RouterTra(r)
	RouterLang(r)
	RouterPlugin(r)

	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		webRoot := filepath.Join(global.WorkDir, "web")

		// 1. 优先尝试返回 webRoot 下的静态文件
		targetFile := filepath.Join(webRoot, path)
		if info, err := os.Stat(targetFile); err == nil && !info.IsDir() {
			c.File(targetFile)
			return
		}

		// 2. ApiMap 检查
		if global.ApiMap != nil {
			if targetPath, ok := global.ApiMap[path].(string); ok {
				if strings.HasPrefix(targetPath, "/file/") {
					fileName := filepath.Base(targetPath)
					c.Header("Content-Disposition", "attachment; filename=\""+fileName+"\"")
				}
				c.Request.URL.Path = targetPath
				r.HandleContext(c)
				c.Abort()
				return
			}
		}

		// 3. API 404
		if strings.HasPrefix(path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{
				"code": 404,
				"msg":  "API Endpoint Not Found",
			})
			return
		}

		// 4. 特定 HTML 页面映射
		routeMap := map[string]string{
			"/doc": "doc.html",
			"/pic": "pic.html",
			"/tra": "tra.html",
			"/mon": "mon.html",
			"/not": "not.html",
			"/bok": "bok.html",
		}

		if htmlFile, ok := routeMap[path]; ok {
			c.File(filepath.Join(webRoot, htmlFile))
			return
		}

		// 5. SPA 兜底
		c.File(filepath.Join(webRoot, "index.html"))
	})

	return r
}
