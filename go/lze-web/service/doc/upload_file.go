package doc

import (
	"lze-web/model/doc/upload"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UploadFile(c *gin.Context) {
	var sendData response.Response[upload.Send]
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "upfile") {
		filename := c.PostForm("filename")
		nowpath := filepath.FromSlash(c.PostForm("nowPath"))
		indexStr := c.PostForm("index")
		tempPath := filepath.Join(global.TempPath, "doc", "uploadFile", filename)
		totalChunkStr := c.PostForm("totalChunk")
		totalChunk, err := strconv.ParseInt(totalChunkStr, 10, 0)

		if err != nil {
			sendData.Msg = err.Error()
			sendData.Code = 400
			c.JSON(sendData.Code, sendData)

			return
		}
		chunk, err := c.FormFile("chunk")
		if err != nil {
			sendData.Msg = err.Error()
			sendData.Code = 400
			c.JSON(sendData.Code, sendData)
			return
		}
		if !global.FileExists(tempPath) {
			os.Mkdir(tempPath, 0755)
		}
		savingPath := filepath.Join(tempPath, indexStr+"_saving")
		c.SaveUploadedFile(chunk, savingPath)
		tmpChunkPath := filepath.Join(tempPath, indexStr)
		os.Rename(savingPath, tmpChunkPath)
		if isFinsh(int(totalChunk), tempPath) {
			targetFile := global.MergeFile(tempPath, totalChunk)
			targetPath := filepath.Join(global.DocPath, nowpath)
			saveName := global.UniqueName(targetPath, filename)
			destPath := filepath.Join(global.DocPath, nowpath, saveName)
			os.Rename(targetFile, destPath)
			os.RemoveAll(tempPath)
			sendData.Data.FileItem = [2]string{saveName, global.FileType(destPath)}
		}
		sendData.Code = 200
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 401
		sendData.Msg = global.GetText("no_upload_file_permit", c)
		c.JSON(sendData.Code, sendData)
	}
}
func isFinsh(totalChunk int, tmpPath string) bool {
	doneFlag := filepath.Join(tmpPath, "done")

	// 原子创建
	f, err := os.OpenFile(doneFlag, os.O_CREATE|os.O_EXCL, 0644)
	if err != nil {
		// 文件已存在 → 说明别人已经合并过
		return false
	}
	f.Close()

	for i := 0; i < totalChunk; i++ {
		if !global.FileExists(filepath.Join(tmpPath, strconv.Itoa(i))) {
			os.Remove(doneFlag) // 回滚
			return false
		}
	}

	return true
}
