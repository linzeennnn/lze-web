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
	user, token := global.GetAuthMes(c)
	name := global.UniqueName(global.BokPath, rec.Name+".html")
	if global.CheckPermit(user, token, "bok", "newbok") {
		global.WriteText(filepath.Join(global.BokPath, name), genBokText(rec.Text))
		c.Status(200)
	} else {
		c.Status(401)
	}
}
func genBokText(text string) string {
	return `<meta http-equiv="refresh" content="0;url=` + text + `">`
}
