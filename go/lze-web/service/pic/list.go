package pic

import (
	"lze-web/model/pic/list"
	"lze-web/pkg/global"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var rec list.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(400, err.Error())
		return
	}
	files := global.ScanDir(filepath.Join(global.PicPath, filepath.FromSlash(rec.Folder)))
	picList := make([]list.FileList, 0, len(files))
	for _, file := range files {
		switch file.FileType {
		case "dir", "dir_link":
			picList = append(picList, list.FileList{
				Name: file.Name,
				Type: file.FileType,
			})
		default:
			if mediaType := CheckType(file.Name); mediaType != "" {
				picList = append(picList, list.FileList{
					Name:  file.Name,
					Type:  file.FileType,
					Media: mediaType,
				})
			}
		}
	}
	var sendData list.Send
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
	var vidFor = []string{".mp4", ".webm", ".ogg", ".ogv", ".mov", ".m4v", ".avi", ".3gp", ".mkv"}
	ext := strings.ToLower(filepath.Ext(name))
	for _, imgExt := range imgFor {
		if ext == imgExt {
			return "img"
		}
	}
	for _, vidExt := range vidFor {
		if ext == vidExt {
			return "vid"
		}
	}
	return ""
}
