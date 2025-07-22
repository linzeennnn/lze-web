package pic

import (
	"lze-web/model/pic/list"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var rec list.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(400, err.Error())
		return
	}
	files := global.ScanDir(filepath.Join(global.PicPath, filepath.FromSlash(rec.Folder)))
	picList := make([][3]string, 0, len(files))
	for _, file := range files {
		switch file.FileType {
		case "dir", "dir_link":
			picList = append(picList, [3]string{file.Name, file.FileType, ""})
		default:
			if mediaType := CheckType(file.Name); mediaType != "" {
				picList = append(picList, [3]string{
					file.Name,
					file.FileType,
					mediaType,
				})
			}
		}
	}
	var sendData list.Send
	sendData.Meta = [3]string{"name", "type", "media"}
	sendData.FileList = picList
	sendData.CurrentFolder = rec.Folder
	parent := filepath.Dir(rec.Folder)
	if parent == "." || parent == "/" {
		parent = ""
	} else {
		sendData.ParentFolder = parent
	}
	sendData.ParentFolder = parent
	c.JSON(200, sendData)
}
func CheckType(name string) string {
	var imgFor = []string{".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg", ".ico", ".apng", ".avif"}
	if global.IncludeExt(name, imgFor) {
		return "img"
	}
	var vidFor = []string{".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v", ".avi", ".3gp", ".mkv"}
	if global.IncludeExt(name, vidFor) {
		return "vid"
	}
	return ""
}
