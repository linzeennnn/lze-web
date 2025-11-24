package doc

import (
	"lze-web/model/doc/link"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Link(c *gin.Context) {
	var rec link.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "link") {
		fullPath := filepath.Join("file", "Documents", rec.Path)
		c.String(200, fullPath)
	} else {
		c.Status(401)
	}
}
