package tra

import (
	"lze-web/model/tra/list"
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
	files := global.ScanDir(filepath.Join(global.TraPath, filepath.FromSlash(rec.Folder)))
	length := len(files)
	docList := make([]list.FileList, length)
	if rec.Folder == "/" || rec.Folder == "" || rec.Folder == " " || rec.Folder == "." {
		delData := global.GetDeldata()
		for i := 0; i < length; i++ {
			docList[i].Name = files[i].Name
			docList[i].Type = files[i].FileType
			if delData[files[i].Name] != nil {
				docList[i].DelData = delData[files[i].Name].(string)
			} else {
				docList[i].DelData = filepath.Join("Recover_file,files[i].Name")
			}
		}

	} else {
		for i := 0; i < length; i++ {
			docList[i].Name = files[i].Name
			docList[i].Type = files[i].FileType
		}
	}
	var sendData list.Send
	par_dir := filepath.Dir(rec.Folder)
	if par_dir == "." || par_dir == "/" {
		sendData.ParentFolder = ""
	} else {
		sendData.ParentFolder = par_dir
	}
	sendData.FileList = docList
	sendData.CurrentFolder = rec.Folder
	c.JSON(200, sendData)
}
