package doc

import (
	downfile "lze-web/model/doc/down_file"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func PostDownloadFile(c *gin.Context) {
	var rec downfile.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "downfile") {
		token := getUrlToken(filepath.Clean(rec.Path))
		c.String(200, token)
	} else {
		c.Status(401)
	}
}
func GetDownLoadFile(c *gin.Context) {
	token := filepath.Base(c.Request.URL.String())
	path := getPath(token)
	filePath := filepath.Join(global.DocPath, path)
	c.FileAttachment(filePath, filepath.Base(filePath))
}
func getPath(token string) string {
	for _, link := range global.FileLinkArr {
		if link.Token == token {
			return link.Path
		}
	}
	return ""
}
func getUrlToken(path string) string {
	var outdatedTime int64
	outdatedTime = -1
	outdatedIndex := -1
	for i, link := range global.FileLinkArr {
		if link.Path == path {
			return link.Token
		} else {
			if link.Time == 0 {
				global.FileLinkArr[i].Path = path
				global.FileLinkArr[i].Token = global.GenJti()
				global.FileLinkArr[i].Time = global.GetTimeStamp()
				return global.FileLinkArr[i].Token
			} else {
				if outdatedTime == -1 || (link.Time < outdatedTime && outdatedTime != -1) {
					outdatedTime = link.Time
					outdatedIndex = i
				}
			}
		}
	}
	global.FileLinkArr[outdatedIndex].Path = path
	global.FileLinkArr[outdatedIndex].Token = global.GenJti()
	global.FileLinkArr[outdatedIndex].Time = global.GetTimeStamp()
	return global.FileLinkArr[outdatedIndex].Token
}
