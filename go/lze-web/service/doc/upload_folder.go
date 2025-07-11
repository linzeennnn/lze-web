package doc

import (
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UploadFolder(c *gin.Context) {
	if global.CheckPermit(c.PostForm("user"), c.PostForm("token"), "doc", "updir") {
		relativePath := filepath.FromSlash(c.PostForm("relativePath"))
		curChunkStr := c.PostForm("currentChunk")
		total, err := strconv.ParseInt(c.PostForm("totalChunks"), 10, 0)
		if err != nil {
			c.String(400, err.Error())
			return
		}
		filename := c.PostForm("fileName")
		tempPath := filepath.Join(global.TempPath, relativePath)
		if curChunkStr == "0" {
			os.MkdirAll(tempPath, 0755)
		}
		file, err := c.FormFile("file")
		if err != nil {
			c.String(400, err.Error())
			return
		}
		c.SaveUploadedFile(file, filepath.Join(tempPath, curChunkStr))
		curCount, _ := strconv.ParseInt(curChunkStr, 10, 0)
		if curCount == total-1 {
			targetFile := global.MergeFile(tempPath, total)
			destPath := filepath.Join(filepath.Dir(tempPath), filename)
			os.Rename(targetFile, destPath+".tmp")
			os.RemoveAll(tempPath)
			os.Rename(destPath+".tmp", destPath)
		}

	} else {
		c.Status(401)
	}
}
