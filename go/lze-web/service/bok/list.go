package bok

import (
	"lze-web/model/bok/list"
	"lze-web/pkg/global"
	"path/filepath"
	"regexp"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	files := global.ScanDir(global.BokPath)
	length := len(files)
	sendData := make([]list.Send, length)
	for i := 0; i < length; i++ {
		sendData[i].Name = global.SplitExt(files[i].Name)
		sendData[i].Content = getUrl(global.ReadText(filepath.Join(global.BokPath, files[i].Name)))
	}
	c.JSON(200, sendData)
}
func getUrl(str string) string {
	re := regexp.MustCompile(`url=([^">]+)`)
	match := re.FindStringSubmatch(str)

	if len(match) > 1 {
		return match[1]
	} else {
		return ""
	}

}
