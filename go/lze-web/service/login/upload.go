package login

import (
	"lze-web/model/login/upload"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Upload(c *gin.Context) {
	var rec upload.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	user, token := global.GetAuthMes(c)
	control, action := getPermitName(rec)
	if global.CheckPermit(user, token, control, action) {
		c.Status(200)
		return
	}
	c.Status(401)
}
func getPermitName(rec upload.Rec) (string, string) {

	if rec.AppType == "doc" {
		if rec.FileType == "dir" {
			return "doc", "updir"
		} else {
			return "doc", "upfile"
		}
	} else {
		return rec.AppType, "upload"
	}
}
