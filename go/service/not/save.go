package not

import (
	"lze-web/model/not/add"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Save(c *gin.Context) {
	var rec add.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "not", "edit") {
		global.WriteText(global.NotPath+rec.NewTitle+".txt", rec.NewContent)
		c.Status(200)
	} else {
		c.Status(401)
	}
}
