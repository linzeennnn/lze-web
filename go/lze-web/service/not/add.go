package not

import (
	"lze-web/model/not/add"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Add(c *gin.Context) {
	var rec add.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
		return
	}
	name := global.UniqueName(global.NotPath, rec.NewTitle+".txt")
	if global.CheckPermit(rec.User, rec.Token, "not", "newnote") {
		global.WriteText(filepath.Join(global.NotPath, name), rec.NewContent)
		c.Status(200)
	} else {
		c.Status(401)
	}
}
