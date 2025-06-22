package not

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Upload(c *gin.Context) {
	username := c.PostForm("user")
	token := c.PostForm("token")
	if global.CheckPermit(username, token, "not", "upload") {
		file, err := c.FormFile("new_note")
		if err != nil {
			c.JSON(400, gin.H{"error": "上传失败：" + err.Error()})
			return
		}
		name := global.UniqueName(global.NotPath, file.Filename)
		if err := c.SaveUploadedFile(file, global.NotPath+name); err != nil {
			c.JSON(400, err)
			return
		}
		c.Status(200)
	} else {
		c.Status(401)
	}
}
