package bok

import (
	"lze-web/model/bok/add"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Add(c *gin.Context) {
	var rec add.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "bok", "newbok") {
		name := global.UniqueName(global.BokPath, rec.Name+".html")
		global.WriteText(filepath.Join(global.BokPath, name), genBokText(rec.Text))
		sendData.Code = 200
		sendData.Msg = global.GetText("add_bok_success", c)
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_add_bok_per", c)
		c.JSON(sendData.Code, sendData)
	}
}
func genBokText(text string) string {
	return `<meta http-equiv="refresh" content="0;url=` + text + `">`
}
