package login

import (
	"fmt"
	"lze-web/model/login/upload"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"strings"

	"github.com/gin-gonic/gin"
)

func Upload(c *gin.Context) {
	var rec upload.Rec
	var sendData response.Response[string]
	if err := c.ShouldBind(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	control, action := getPermitName(rec.Action)
	global.InitUserMes(c)
	if global.CheckPermit(c, control, action) {
		sendData.Code = 200
		sendData.Msg = global.GetText("allow_upload", c)
		token := global.GenSessionToken()
		global.SetTotalFileCountItem(token)
		sendData.Data = token
		c.JSON(200, sendData)
		return
	}
	sendData.Code = 403
	sendData.Msg = global.GetText("not_allow_upload", c)
	c.JSON(403, sendData)
}
func getPermitName(action string) (string, string) {
	fmt.Println(action)
	parts := strings.Split(action, "/")
	return parts[0], parts[1]
}
