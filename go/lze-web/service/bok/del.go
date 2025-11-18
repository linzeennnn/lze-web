package bok

import (
	"lze-web/model/bok/del"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var rec del.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "bok", "delete") {
		err := os.Remove(filepath.Join(global.BokPath, rec.Name+".html"))
		if err != nil {
			c.String(400, "delete fail."+err.Error())
		} else {
			c.Status(200)
		}

	} else {
		c.Status(401)
	}

}
