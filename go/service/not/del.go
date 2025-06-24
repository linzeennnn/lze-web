package not

import (
	"lze-web/model/not/del"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var rec del.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "not", "delete") {
		err := os.Remove(filepath.Join(global.NotPath, rec.FileName))
		if err != nil {
			c.String(400, "删除失败"+err.Error())
		} else {
			c.Status(200)
		}

	} else {
		c.Status(401)
	}

}
