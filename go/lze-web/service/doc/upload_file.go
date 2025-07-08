package doc

import (
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	if global.CheckPermit(c.PostForm("user"), c.PostForm("token"), "doc", "upfile") {
		filename := c.PostForm("fileName")
		nowpath := filepath.FromSlash(c.PostForm("nowpath"))
		tempPath := filepath.Join(global.TempPath, filename)
		cur := c.PostForm("currentChunk")
		total, err := strconv.ParseInt(c.PostForm("totalChunks"), 10, 0)
		if err != nil {
			c.String(400, err.Error())
			return
		}

		if cur == "0" {
			os.Mkdir(tempPath, 0755)
		}
		file, err := c.FormFile("file")
		if err != nil {
			c.String(400, err.Error())
			return
		}
		c.SaveUploadedFile(file, filepath.Join(tempPath, cur))
		curCount, _ := strconv.ParseInt(cur, 10, 0)
		if curCount == total-1 {
			targetFile := global.MergeFile(tempPath, total)
			saveName := global.UniqueName(global.DocPath, filename)
			os.Rename(targetFile, filepath.Join(global.DocPath, nowpath, saveName))
			os.RemoveAll(tempPath)
		}
		c.Status(200)
	} else {
		c.Status(401)
	}

}
