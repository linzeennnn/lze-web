package router

import (
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func RouterStatic(r *gin.Engine) {
	r.Static("/web", filepath.Join(global.WorkDir, "web", "web"))
	r.Static("/icon", filepath.Join(global.WorkDir, "web", "icon"))
	r.Static("/wallpaper", filepath.Join(global.WorkDir, "web", "wallpaper"))
	r.Static("/cat", filepath.Join(global.WorkDir, "web", "cat"))
	r.Static("/file", global.FilePath)
	r.GET("/", func(c *gin.Context) {
		c.File(filepath.Join(global.WorkDir, "web", "index.html"))
	})
	r.GET("/index.html", func(c *gin.Context) {
		c.File(filepath.Join(global.WorkDir, "web", "index.html"))
	})
	r.GET("/manifest.json", func(c *gin.Context) {
		c.File(filepath.Join(global.WorkDir, "web", "manifest.json"))
	})

}
