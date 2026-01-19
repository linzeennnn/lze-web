package pic

import (
	"lze-web/model/pic/del"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Delete(c *gin.Context) {
	var rec del.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	picTrashPath := filepath.Join(global.TraPath, "Pictures")
	os.MkdirAll(picTrashPath, os.ModePerm)
	global.InitUserMes(c)
	if global.CheckPermit(c, "pic", "delete") {
		for _, delItem := range rec.DelArr {
			srcPath := filepath.Join(global.PicPath, filepath.FromSlash(rec.NowPath), delItem)
			dstPath := filepath.Join(picTrashPath, delItem)
			os.Rename(srcPath, dstPath)
		}
		sendData.Code = 200
		sendData.Msg = global.GetText("del_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_del_per", c)
		c.JSON(403, sendData)
	}
}
