package not

import (
	"lze-web/model/not/edit"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Edit(c *gin.Context) {
	var rec edit.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "not", "edit") {
		var name string
		if rec.NewTitle == rec.OldTitle {
			name = rec.OldTitle + ".txt"
		} else {
			os.Remove(filepath.Join(global.NotPath, rec.OldTitle+".txt"))
			name = global.UniqueName(global.NotPath, rec.NewTitle+".txt")
		}
		global.WriteText(filepath.Join(global.NotPath, name), rec.NewContent)
		c.Status(200)
	} else {
		c.Status(401)
	}

}
