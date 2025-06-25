package router

import (
	"lze-web/pkg/global"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	r := gin.Default()
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
	return r
}
