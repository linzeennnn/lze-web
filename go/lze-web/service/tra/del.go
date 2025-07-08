package tra

import (
	"lze-web/model/tra/del"
	"lze-web/pkg/global"
	"os"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var rec del.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "tra", "clean") {
		os.RemoveAll(global.TraPath)
		os.MkdirAll(global.TraPath, 0755)
		global.CleanDelData()
	} else {
		c.Status(401)
	}

}
