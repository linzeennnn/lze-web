package pic

import (
	"lze-web/model/pic/upload"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Edit(c *gin.Context) {
	var sendData response.Response[upload.Send]
	global.InitUserMes(c)
	if global.CheckPermit(c, "pic", "upload") {
		filename := c.PostForm("filename")
		nowpath := filepath.FromSlash(c.PostForm("nowPath"))
		indexStr := c.PostForm("index")
		totalFile, _ := strconv.ParseInt(c.PostForm("totalFile"), 10, 0)
		uploadToken := c.PostForm("uploadToken")
		tempPath := filepath.Join(global.TempPath, "pic", uploadToken, filename)
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
		if global.IsTmpFinsh(int(totalChunk), tempPath) {
			env := global.GetEnv(c)
			var destPath string
			targetFile := global.MergeFile(tempPath, totalChunk)

			switch env.Source {
			case "doc":
				destPath = filepath.Join(global.DocPath, nowpath, filename)
			default:
				destPath = filepath.Join(global.PicPath, nowpath, filename)
			}
			destPath = filepath.Join(global.PicPath, nowpath, filename)
			os.Rename(targetFile, destPath)
			sendData.Data.FileItem = [2]string{filename, global.FileType(destPath)}
			if global.IsUploadFinished(uploadToken, int(totalFile)) {
				os.RemoveAll(filepath.Join(global.TempPath, "pic", uploadToken))
				global.RemoveTotalFileCountItem(uploadToken)
				sendData.Msg = global.GetText("edit_completed", c)
			} else {
				global.AddTotalFileCount(uploadToken)
			}
		}
		sendData.Code = 200
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 401
		sendData.Msg = global.GetText("no_edit_permit", c)
		c.JSON(sendData.Code, sendData)
	}
}
