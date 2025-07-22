package not

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	files := global.ScanDir(global.NotPath)
	length := len(files)
	var List []string
	for i := 0; i < length; i++ {
		List = append(List, global.SplitExt(files[i].Name))
	}
	c.JSON(200, List)
}
