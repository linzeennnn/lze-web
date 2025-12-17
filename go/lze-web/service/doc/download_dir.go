package doc

import (
	"archive/zip"
	"io"
	downdir "lze-web/model/doc/down_dir"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func PostDownloadDir(c *gin.Context) {
	var rec downdir.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "downdir") {
		path := filepath.Clean(rec.Path)
		token := getDirUrlToken(path)
		zipDir(path, token)
		sendData.Code = 200
		sendData.Msg = global.GetText("downDir_success", c)
		sendData.Data = token
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_downDir_per", c)
		c.JSON(403, sendData)
	}
}

func GetDownLoadDir(c *gin.Context) {
	token := filepath.Base(c.Request.URL.String())
	filePath := getDirPath(token)
	c.FileAttachment(filePath, filepath.Base(filePath))
}
func getDirPath(token string) string {
	for _, link := range global.DirLinkArr {
		if link.Token == token {
			fileName := filepath.Base(link.Path) + ".zip"
			return filepath.Join(global.TempPath, token, fileName)
		}
	}
	return ""
}

// 压缩
func zipDir(path, token string) {
	FolderPath := filepath.FromSlash(path)
	source := filepath.Join(global.DocPath, FolderPath)
	zipName := filepath.Base(FolderPath) + ".zip"
	tempPath := filepath.Join(global.TempPath, token)
	zipPath := filepath.Join(tempPath, zipName)
	if !global.FileExists(zipPath) {
		os.Mkdir(tempPath, 0755)
		compress(source, zipPath)
	}
}
func compress(src_dir string, zip_file_name string) {
	zipfile, err := os.Create(zip_file_name)
	if err != nil {
		return
	}
	defer zipfile.Close()
	archive := zip.NewWriter(zipfile)
	defer archive.Close()
	filepath.Walk(src_dir, func(path string, info os.FileInfo, _ error) error {
		if path == src_dir {
			return nil
		}
		header, _ := zip.FileInfoHeader(info)
		relPath, err := filepath.Rel(src_dir, path)
		if err != nil {
			return err
		}
		header.Name = filepath.ToSlash(relPath)

		if info.IsDir() {
			header.Name += `/`
		} else {
			header.Method = zip.Deflate
		}
		writer, _ := archive.CreateHeader(header)
		if !info.IsDir() {
			file, _ := os.Open(path)
			defer file.Close()
			io.Copy(writer, file)
		}
		return nil
	})
}

func getDirUrlToken(path string) string {
	var outdatedTime int64
	outdatedTime = -1
	outdatedIndex := -1
	for i, link := range global.DirLinkArr {
		if link.Path == path {
			global.DirLinkArr[i].Time = global.GetTimeStampS()
			return link.Token
		} else {
			if link.Time == 0 {
				global.DirLinkArr[i].Path = path
				global.DirLinkArr[i].Token = global.GenJti()
				global.DirLinkArr[i].Time = global.GetTimeStampS()
				return global.DirLinkArr[i].Token
			} else {
				if outdatedTime == -1 || (link.Time < outdatedTime && outdatedTime != -1) {
					outdatedTime = link.Time
					outdatedIndex = i
				}
			}
		}
	}
	delPath := filepath.Join(global.TempPath, global.DirLinkArr[outdatedIndex].Token)
	os.RemoveAll(delPath)
	global.DirLinkArr[outdatedIndex].Path = path
	global.DirLinkArr[outdatedIndex].Token = global.GenJti()
	global.DirLinkArr[outdatedIndex].Time = global.GetTimeStampS()
	return global.DirLinkArr[outdatedIndex].Token
}
