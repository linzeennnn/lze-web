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
	files := global.ScanDir(filepath.Join(global.DocPath, filepath.FromSlash(rec.Folder)))
	length := len(files)
	docList := make([]list.FileList, length)
	for i := 0; i < length; i++ {
		docList[i].Name = files[i].Name
		docList[i].Type = files[i].FileType
	}
	var sendData list.Send
	sendData.FileList = docList
	sendData.CurrentFolder = rec.Folder
	par_dir := filepath.Dir(rec.Folder)
	if par_dir == "." || par_dir == "/" {
		sendData.ParentFolder = ""
	} else {
		sendData.ParentFolder = par_dir
	}
	c.JSON(200, sendData)
}
