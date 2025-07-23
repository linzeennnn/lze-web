package doc

import (
	"lze-web/model/doc/list"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var rec list.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	filePath := filepath.Join(global.DocPath, filepath.FromSlash(rec.File))
	fileType := global.FileType(filePath)
	if fileType == "dir" || fileType == "dir_link" {
		getDir(rec, c)
	}
	if fileType == "file" || fileType == "file_link" {
		getFile(rec, c)
	}
}
func getDir(rec list.Rec, c *gin.Context) {
	files := global.ScanDir(filepath.Join(global.DocPath, filepath.FromSlash(rec.File)))
	length := len(files)
	docList := make([][2]string, length)
	for i := 0; i < length; i++ {
		docList[i][0] = files[i].Name
		docList[i][1] = files[i].FileType
	}
	var sendData list.SendDir
	sendData.Meta = [2]string{"name", "type"}
	sendData.FileType = "dir"
	sendData.FileList = docList
	sendData.CurrentFolder = rec.File
	par_dir := filepath.Dir(rec.File)
	if par_dir == "." || par_dir == "/" {
		sendData.ParentFolder = ""
	} else {
		sendData.ParentFolder = par_dir
	}
	c.JSON(200, sendData)

}
func getFile(rec list.Rec, c *gin.Context) {
	extList := []string{
		".html", ".htm", ".css", ".js", ".mjs", ".json", ".xml", ".rss", ".svg", ".webmanifest",
		".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".ico", ".avif",
		".mp3", ".wav", ".ogg", ".oga", ".m4a", ".aac", ".flac",
		".mp4", ".webm", ".ogv", ".ogg", ".mov",
		".pdf", ".txt", ".csv", ".md",
		".woff", ".woff2", ".ttf", ".otf", ".eot",
		".wasm",
	}
	url := filepath.FromSlash(filepath.Join("file/Documents", rec.File))
	var sendData list.SendFile
	if global.IncludeExt(rec.File, extList) {
		sendData.FileType = "file"
		sendData.Url = url
		sendData.View = true
	} else {
		sendData.FileType = "file"
		sendData.Url = ""
		sendData.View = false
	}
	c.JSON(200, sendData)
}
