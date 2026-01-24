package doc

import (
	"lze-web/model/doc/list"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var rec list.Rec
	if err := c.ShouldBind(&rec); err != nil {
		var sendData response.Response[string]
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
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
	var resData response.Response[list.SendDir]
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
	resData.Data = sendData
	resData.Code = 200
	c.JSON(200, resData)

}
func getFile(rec list.Rec, c *gin.Context) {
	var resData response.Response[list.SendFile]
	url := filepath.FromSlash(filepath.Join("file/Documents", rec.File))
	var sendData list.SendFile
	sendData.FileType = "file"
	sendData.Url = url
	sendData.InnerApp = CheckFileType(filepath.Join(global.DocPath, rec.File))
	resData.Data = sendData
	resData.Code = 200
	c.JSON(200, resData)
}
func CheckFileType(path string) []string {
	ext := strings.ToLower(filepath.Ext(path))
	r := []string{}

	img := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true, ".gif": true,
		".webp": true, ".bmp": true, ".ico": true, ".avif": true,
	}
	vid := map[string]bool{
		".mp4": true, ".webm": true, ".ogv": true, ".mov": true,
	}
	html := map[string]bool{".html": true, ".htm": true}
	svg := map[string]bool{".svg": true}
	browser := map[string]bool{
		".html": true, ".htm": true, ".css": true, ".js": true, ".mjs": true,
		".json": true, ".xml": true, ".rss": true, ".svg": true, ".webmanifest": true,
		".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true,
		".bmp": true, ".ico": true, ".avif": true,
		".mp3": true, ".wav": true, ".ogg": true, ".oga": true,
		".m4a": true, ".aac": true, ".flac": true,
		".mp4": true, ".webm": true, ".ogv": true, ".mov": true,
		".pdf": true, ".csv": true, ".md": true,
		".woff": true, ".woff2": true, ".ttf": true, ".otf": true,
		".eot": true, ".wasm": true,
	}

	if html[ext] {
		return []string{"doc", "not"}
	}
	if svg[ext] {
		return []string{"img", "not"}
	}

	if isText(path) {
		r = append(r, "not")
	}
	if img[ext] {
		r = append(r, "img")
	}
	if vid[ext] {
		r = append(r, "vid")
	}
	if browser[ext] && !img[ext] && !vid[ext] && !contains(r, "not") {
		r = append(r, "doc")
	}

	return r
}

// 判断是否为文本
func isText(p string) bool {
	f, e := os.Open(p)
	if e != nil {
		return false
	}
	defer f.Close()
	b := make([]byte, 4096)
	n, e := f.Read(b)
	if e != nil || n == 0 {
		return false
	}
	b = b[:n]
	for _, c := range b {
		if c == 0 {
			return false
		}
	}
	return utf8.Valid(b)
}
func contains(a []string, s string) bool {
	for _, v := range a {
		if v == s {
			return true
		}
	}
	return false
}
