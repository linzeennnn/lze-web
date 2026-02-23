package doc

import (
	"lze-web/model/doc/upload"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func UploadFolder(c *gin.Context) {
	var sendData response.Response[upload.Send]
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "upfile") {
		filename := c.PostForm("filename")
		indexStr := c.PostForm("index")
		nowpath := filepath.FromSlash(c.PostForm("nowPath"))
		relativePath := c.PostForm("relativePath")
		totalFile, _ := strconv.ParseInt(c.PostForm("totalFile"), 10, 0)
		uploadToken := c.PostForm("uploadToken")
		uploadingPath := filepath.Join(global.TempPath, "doc", "uploadDir", "uploading", uploadToken, relativePath)
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
		if !global.FileExists(uploadingPath) {
			os.MkdirAll(uploadingPath, 0755)
		}
		savingPath := filepath.Join(uploadingPath, indexStr+"_saving")
		c.SaveUploadedFile(chunk, savingPath)
		tmpChunkPath := filepath.Join(uploadingPath, indexStr)
		os.Rename(savingPath, tmpChunkPath)
		if isFinsh(int(totalChunk), uploadingPath) {
			targetFile := global.MergeFile(uploadingPath, totalChunk)
			tmpFinshPath := filepath.Join(global.TempPath, "doc", "uploadDir", "finshed", uploadToken, filepath.Dir(relativePath))
			os.MkdirAll(tmpFinshPath, 0755)
			destPath := filepath.Join(tmpFinshPath, filename)
			os.Rename(targetFile, destPath)
			if global.IsUploadFinished(uploadToken, int(totalFile)) {
				dirName := FirstDir(relativePath)
				targetPath := filepath.Join(global.DocPath, nowpath)
				saveName := global.UniqueName(targetPath, dirName)
				sourcePath := filepath.Join(global.TempPath, "doc", "uploadDir", "finshed", uploadToken, dirName)
				finalPath := filepath.Join(global.DocPath, nowpath, saveName)
				os.Rename(sourcePath, finalPath)
				os.RemoveAll(filepath.Join(global.TempPath, "doc", "uploadDir", "uploading", uploadToken))
				os.RemoveAll(filepath.Join(global.TempPath, "doc", "uploadDir", "finshed", uploadToken))
				global.RemoveTotalFileCountItem(uploadToken)
				sendData.Data.FileItem = [2]string{saveName, global.FileType(finalPath)}
				sendData.Msg = global.GetText("upload_completed", c)
			} else {
				global.AddTotalFileCount(uploadToken)
			}
		}
		sendData.Code = 200
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 401
		sendData.Msg = global.GetText("no_upload_file_permit", c)
		c.JSON(sendData.Code, sendData)
	}
}

// 获取路径第一个目录
func FirstDir(path string) string {
	cleanPath := filepath.Clean(path)
	// 去掉卷标（Windows 比如 C:\）
	volume := filepath.VolumeName(cleanPath)
	cleanPath = strings.TrimPrefix(cleanPath, volume)

	// 去掉开头的路径分隔符
	cleanPath = strings.TrimPrefix(cleanPath, string(filepath.Separator))

	parts := strings.Split(cleanPath, string(filepath.Separator))

	if len(parts) > 0 {
		return parts[0]
	}
	return ""
}
