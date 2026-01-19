package lang

import (
	"encoding/json"
	"lze-web/model/lang"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetLang(c *gin.Context) {

	var rec lang.Rec
	var sendData response.Response[interface{}]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	lanType := rec.Lang
	path := filepath.Join(global.WorkDir, "web", "assets", "lang", lanType+".json")

	var data interface{}
	if err := json.Unmarshal([]byte(global.ReadText(path)), &data); err != nil {
		sendData.Code = 500
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}

	sendData.Code = 200
	sendData.Data = data
	c.JSON(sendData.Code, sendData)
}
