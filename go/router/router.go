package router

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	r := gin.Default()

	r.Static("/web", global.WorkDir+"web/web/")
	r.GET("/", func(c *gin.Context) {
		c.File(global.WorkDir + "web/index.html")
	})

	// ******************测试api****************
	r.GET("/test", func(c *gin.Context) {
		c.File(global.WorkDir + "test/json.html")
	})
	// ******************测试api****************
	RouterLogin(r)

	return r
}
