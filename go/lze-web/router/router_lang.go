package router

import (
	"encoding/json"
	"lze-web/model/lang"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func RouterLang(r *gin.Engine) {

	r.POST("/server/lang", func(c *gin.Context) {
		var rec lang.Rec
		if err := c.ShouldBindJSON(&rec); err != nil {
			c.JSON(400, err)
			return
		}
		lanType := rec.Lang
		path := filepath.Join(global.WorkDir, "web", "assets", "lang", lanType+".json")

		var data interface{}
		if err := json.Unmarshal([]byte(global.ReadText(path)), &data); err != nil {
			c.JSON(500, gin.H{"error": "invalid JSON"})
			return
		}

		c.JSON(200, data)
	})

}
