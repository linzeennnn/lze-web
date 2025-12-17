package doc

import (
	downfile "lze-web/model/doc/down_file"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func PostDownloadFile(c *gin.Context) {
	var rec downfile.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "downfile") {
		token := getFileUrlToken(filepath.Clean(rec.Path))
		sendData.Code = 200
		sendData.Msg = global.GetText("downFile_success", c)
		sendData.Data = token
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_downFile_per", c)
		c.JSON(403, sendData)
	}
}
func GetDownLoadFile(c *gin.Context) {
	token := filepath.Base(c.Request.URL.String())
	path := getFilePath(token)
	filePath := filepath.Join(global.DocPath, path)
	c.FileAttachment(filePath, filepath.Base(filePath))
}
func getFilePath(token string) string {
	for _, link := range global.FileLinkArr {
		if link.Token == token {
			return link.Path
		}
	}
	return ""
}
func getFileUrlToken(path string) string {
	var outdatedTime int64
	outdatedTime = -1
	outdatedIndex := -1
	for i, link := range global.FileLinkArr {
		if link.Path == path {
			global.FileLinkArr[i].Time = global.GetTimeStampS()
			return link.Token
		} else {
			if link.Time == 0 {
				global.FileLinkArr[i].Path = path
				global.FileLinkArr[i].Token = global.GenJti()
				global.FileLinkArr[i].Time = global.GetTimeStampS()
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
	global.FileLinkArr[outdatedIndex].Time = global.GetTimeStampS()
	return global.FileLinkArr[outdatedIndex].Token
}
