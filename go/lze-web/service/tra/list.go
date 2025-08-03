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
	docList := make([][3]string, length)
	if rec.Folder == "/" || rec.Folder == "" || rec.Folder == " " || rec.Folder == "." {
		delData := global.GetDeldata()
		for i := 0; i < length; i++ {
			docList[i][0] = files[i].Name
			docList[i][1] = files[i].FileType
			if delData[files[i].Name] != nil {
				docList[i][2] = delData[files[i].Name].(string)
			} else {
				docList[i][2] = filepath.Join("Recover_file", files[i].Name)
			}
		}

	} else {
		for i := 0; i < length; i++ {
			docList[i][0] = files[i].Name
			docList[i][1] = files[i].FileType
		}
	}
	var sendData list.Send
	par_dir := filepath.Dir(rec.Folder)
	if par_dir == "." || par_dir == "/" {
		sendData.ParentFolder = ""
	} else {
		sendData.ParentFolder = par_dir
	}
	sendData.Meta = [3]string{"name", "type", "delData"}
	sendData.FileList = docList
	sendData.CurrentFolder = rec.Folder
	c.JSON(200, sendData)
}
