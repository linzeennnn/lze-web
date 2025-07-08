package home

import (
	doclist "lze-web/model/home/doc_list"
	fileSystem "lze-web/model/other/fs"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func DocList(c *gin.Context) {
	var rec doclist.Rec
	var files []fileSystem.Files
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	path := filepath.Join(global.DocPath, rec.Name)
	filetype := global.FileType(path)
	if filetype == "dir" || filetype == "dir_link" {
		filetype = "dir"
		files = global.ScanDir(path)
	} else if filetype == "file" || filetype == "file_link" {
		filetype = "file"
	}
	length := len(files)
	list := make([]string, length)
	for i := 0; i < length; i++ {
		list[i] = files[i].Name
	}
	var sendData doclist.Send
	sendData.Filetype = filetype
	sendData.List = list
	c.JSON(200, sendData)
}
