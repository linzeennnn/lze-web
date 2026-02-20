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

func UploadFolder(c *gin.Context) {
	var sendData response.Response[upload.Send]
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "upfile") {
		filename := c.PostForm("filename")
		indexStr := c.PostForm("index")
		relativePath := c.PostForm("relativePath")
		uploadToken := c.PostForm("uploadToken")
		tempPath := filepath.Join(global.TempPath, "doc", "uploadDir", "uploading", uploadToken, relativePath)
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
			os.MkdirAll(tempPath, 0755)
		}
		savingPath := filepath.Join(tempPath, indexStr+"_saving")
		c.SaveUploadedFile(chunk, savingPath)
		tmpChunkPath := filepath.Join(tempPath, indexStr)
		os.Rename(savingPath, tmpChunkPath)
		if isFinsh(int(totalChunk), tempPath) {
			targetFile := global.MergeFile(tempPath, totalChunk)
			tmpFinshPath := filepath.Join(global.TempPath, "doc", "uploadDir", "uploading", uploadToken, filepath.Dir(relativePath))
			os.MkdirAll(tmpFinshPath, 0755)
			destPath := filepath.Join(tmpFinshPath, filename)
			os.Rename(targetFile, destPath)
			sendData.Msg = global.GetText("upload_completed", c)
		}
		sendData.Code = 200
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 401
		sendData.Msg = global.GetText("no_upload_file_permit", c)
		c.JSON(sendData.Code, sendData)
	}
}
