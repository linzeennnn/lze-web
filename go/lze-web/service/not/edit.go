package not

import (
	"lze-web/model/not/edit"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Edit(c *gin.Context) {
	var rec edit.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "not", "edit") {
		var name string
		env := global.GetEnv(c)
		if rec.NewTitle == rec.OldTitle {
			name = rec.OldTitle + ".txt"
		} else {
			os.Remove(filepath.Join(global.NotPath, rec.OldTitle+".txt"))
			name = global.UniqueName(global.NotPath, rec.NewTitle+".txt")
		}
		switch env.Source {
		case "doc":
			global.WriteText(filepath.Join(global.DocPath, rec.Path), rec.NewContent)
		default:
			global.WriteText(filepath.Join(global.NotPath, name), rec.NewContent)
		}
		sendData.Code = 200
		sendData.Msg = global.GetText("modify_note_success", c)
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_modify_note_per", c)
		c.JSON(sendData.Code, sendData)
	}

}
