package bok

import (
	geturl "lze-web/model/bok/get_url"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
)

func GetUrl(c *gin.Context) {
	var rec geturl.Rec
	var sendData response.Response[geturl.Send]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	name := rec.Name + ".html"
	path := filepath.Join(global.BokPath, name)
	now := time.Now()
	err := os.Chtimes(path, now, now)
	if err != nil {
		panic(err)
	}
	urlText := global.ReadText(path)
	re := regexp.MustCompile(`url=([^">]+)`)
	match := re.FindStringSubmatch(urlText)

	sendData.Code = 200
	if len(match) > 1 {
		urlStr := match[1]
		u, _ := url.Parse(urlStr)
		sendData.Data.Url = urlStr
		sendData.Data.Protocol = u.Scheme
		sendData.Data.Path = u.Host + u.Path
	} else {
		sendData.Code = 404
		sendData.Msg = global.GetText("url_not_found", c)
	}
	c.JSON(sendData.Code, sendData)
}
