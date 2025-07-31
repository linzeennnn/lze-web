package tra

import (
	"lze-web/model/bok/del"
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
	user, token := global.GetAuthMes(c)
	if global.CheckPermit(user, token, "tra", "clean") {
		os.RemoveAll(global.TraPath)
		os.MkdirAll(global.TraPath, 0755)
		global.CleanDelData()
	} else {
		c.Status(401)
	}

}
