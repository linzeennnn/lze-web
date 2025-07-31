package pic

import (
	"lze-web/pkg/global"
	"os"
	"path"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Upload(c *gin.Context) {
	user, token := global.GetAuthMes(c)
	if global.CheckPermit(user, token, "pic", "upload") {
		filename := c.PostForm("fileName")
		checkName := CheckType(filename)
		if checkName == "" {
			c.String(400, filename+":不支持文件类型")
			return
		}
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
			targetDir := path.Join(global.PicPath, nowpath)
			saveName := global.UniqueName(targetDir, filename)
			os.Rename(targetFile, filepath.Join(targetDir, saveName))
			os.RemoveAll(tempPath)
		}
		c.Status(200)
	} else {
		c.Status(401)
	}

}
