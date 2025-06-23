package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Router() *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())
	RouterStatic(r)
	RouterLogin(r)
	RouterHome(r)
	RouterSystem(r)
	RouterBok(r)
	RouterNot(r)
	RouterMon(r)
	RouterPic(r)
	return r
}
