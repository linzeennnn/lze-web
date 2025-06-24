package bok

import (
	"lze-web/model/bok/recent"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func Recent(c *gin.Context) {
	var rec recent.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(400, err)
	}
	now := time.Now()
	err := os.Chtimes(filepath.Join(global.BokPath, rec.Filename), now, now)
	if err != nil {
		panic(err)
	}
}
