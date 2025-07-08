package bok

import (
	"lze-web/model/bok/add"
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
	name := global.UniqueName(global.BokPath, rec.Name)
	if global.CheckPermit(rec.User, rec.Token, "bok", "newbok") {
		global.WriteText(filepath.Join(global.BokPath, name), rec.Text)
		c.Status(200)
	} else {
		c.Status(401)
	}
}
