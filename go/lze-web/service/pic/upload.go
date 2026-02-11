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
	global.InitUserMes(c)
	var actionStr string
	isEdit := (c.PostForm("edit") == "true")
	if isEdit {
		actionStr = "edit"
	} else {
		actionStr = "upload"
	}
	if global.CheckPermit(c, "pic", actionStr) {
		filename := c.PostForm("fileName")
		checkName := global.FileTypeMap[global.GetExtName(filename)]
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
			var saveName string
			env := global.GetEnv(c)
			var targetDir string
			targetFile := global.MergeFile(tempPath, total)
			switch env.Source {
			case "doc":
				targetDir = path.Join(global.DocPath, nowpath)
			default:
				targetDir = path.Join(global.PicPath, nowpath)
			}
			if isEdit {
				saveName = filename
			} else {
				saveName = global.UniqueName(targetDir, filename)
			}
			os.Rename(targetFile, filepath.Join(targetDir, saveName))
			os.RemoveAll(tempPath)
		}
		c.Status(200)
	} else {
		c.Status(401)
	}

}
