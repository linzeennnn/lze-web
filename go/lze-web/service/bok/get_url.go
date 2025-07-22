package bok

import (
	geturl "lze-web/model/bok/get_url"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
)

func GetUrl(c *gin.Context) {
	var rec geturl.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
		return
	}
	name := rec.Name + ".html"
	path := filepath.Join(global.BokPath, name)
	now := time.Now()
	err := os.Chtimes(path, now, now)
	if err != nil {
		panic(err)
	}
	url := global.ReadText(path)
	re := regexp.MustCompile(`url=([^">]+)`)
	match := re.FindStringSubmatch(url)

	if len(match) > 1 {
		c.String(200, match[1])
	} else {
		c.String(200, "")
	}
}
