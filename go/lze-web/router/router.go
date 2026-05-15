package router

import (
	"fmt"
	"lze-web/pkg/global"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	// 设置 Gin 模式 (可选)
	// gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	// 1. 配置全局中间件
	switch global.Gzip {
	case "yes":
		r.Use(gzip.Gzip(gzip.DefaultCompression))
	case "no":
	default:
		fmt.Println("work_config.json: gzip(config error)")
		return nil
	}

	r.Use(cors.Default())

	// 限制上传大小中间件
	r.Use(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, global.MaxUploadSize)
		c.Next()
	})

	// 2. 挂载所有业务模块路由
	// 注意：如果 ApiMap 映射的是静态文件路径，确保 RouterStatic 中配置了对应的静态服务
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

	// 3. 全局兜底方案 (NoRoute)
	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		// --- 逻辑核心：ApiMap 检查 ---
		if global.ApiMap != nil {
			if targetPath, ok := global.ApiMap[path].(string); ok {
				if strings.HasPrefix(targetPath, "/file/") {
					fileName := filepath.Base(targetPath)
					c.Header("Content-Disposition", "attachment; filename=\""+fileName+"\"")
				}
				// 修改请求路径
				c.Request.URL.Path = targetPath

				// 重新进行路由分发（回到第一步：url解析）
				r.HandleContext(c)

				// 必须 Abort，否则 HandleContext 执行完回传后，会继续向下执行返回 index.html
				c.Abort()
				return
			}
		}

		// --- 如果 ApiMap 找不到，或者 HandleContext 重新匹配后依然进到这里 ---

		// 1. 检查是否是 API 接口
		if strings.HasPrefix(path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{
				"code": 404,
				"msg":  "API Endpoint Not Found",
			})
			return
		}

		// 2. 检查特定 HTML 页面映射
		routeMap := map[string]string{
			"/doc": "doc.html",
			"/pic": "pic.html",
			"/tra": "tra.html",
			"/mon": "mon.html",
			"/not": "not.html",
			"/bok": "bok.html",
		}

		webRoot := filepath.Join(global.WorkDir, "web")

		if htmlFile, ok := routeMap[path]; ok {
			targetFile := filepath.Join(webRoot, htmlFile)
			c.File(targetFile)
			return
		}

		// 3. SPA 核心逻辑：上述都不匹配时返回 index.html
		// 注意：如果 path 此时是映射后的 "/file/Documents/..." 且没被 RouterStatic 捕获，
		// 最终也会落到这里。
		c.File(filepath.Join(webRoot, "index.html"))
	})
	return r
}
