package not

import (
	gettext "lze-web/model/not/get_text"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetText(c *gin.Context) {
	var rec gettext.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	path := filepath.Join(global.FilePath, "Note", rec.Name+".txt")
	c.String(200, global.ReadText(path))
}
