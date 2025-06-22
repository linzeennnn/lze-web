package router

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func RouterStatic(r *gin.Engine) {
	r.Static("/web", global.WorkDir+"web/web/")
	r.Static("/icon", global.WorkDir+"web/icon/")
	r.Static("/wallpaper", global.WorkDir+"web/wallpaper/")
	r.Static("/cat", global.WorkDir+"web/cat/")
	r.Static("/file", global.FilePath)
	r.GET("/", func(c *gin.Context) {
		c.File(global.WorkDir + "web/index.html")
	})
	r.GET("/index.html", func(c *gin.Context) {
		c.File(global.WorkDir + "web/manifest.json")
	})
	r.GET("/manifest.json", func(c *gin.Context) {
		c.File(global.WorkDir + "web/manifest.json")
	})

}
