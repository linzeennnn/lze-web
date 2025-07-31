package not

import (
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Upload(c *gin.Context) {
	user, token := global.GetAuthMes(c)
	if global.CheckPermit(user, token, "not", "upload") {
		file, err := c.FormFile("new_note")
		if err != nil {
			c.String(400, err.Error())
			return
		}
		name := global.UniqueName(global.NotPath, file.Filename+".txt")
		if err := c.SaveUploadedFile(file, filepath.Join(global.NotPath, name)); err != nil {
			c.JSON(400, err)
			return
		}
		c.Status(200)
	} else {
		c.Status(401)
	}
}
