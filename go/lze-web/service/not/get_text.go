package not

import (
	gettext "lze-web/model/not/get_text"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetText(c *gin.Context) {
	var rec gettext.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	path := filepath.Join(global.FilePath, "Note", rec.Name+".txt")
	sendData.Code = 200
	sendData.Data = global.ReadText(path)
	c.JSON(sendData.Code, sendData)
}
