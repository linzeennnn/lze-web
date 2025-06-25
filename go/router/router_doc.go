package router

import (
	"lze-web/service/doc"

	"github.com/gin-gonic/gin"
)

func RouterDoc(r *gin.Engine) {
	loginGroup := r.Group("/server/doc")
	{
		loginGroup.POST("/list", doc.List)
		loginGroup.POST("/upload_file", doc.UploadFile)
		loginGroup.POST("/upload_folder", doc.UploadFolder)
		loginGroup.POST("/move_folder", doc.MoveFolder)
		loginGroup.POST("/new_folder", doc.NewFolder)
		loginGroup.POST("/copy", doc.Copy)
		loginGroup.POST("/move", doc.Move)
		loginGroup.POST("/rename", doc.Rename)
		loginGroup.POST("/zip_folder", doc.ZipFolder)
		loginGroup.GET("/down_zip", doc.DownZip)
		loginGroup.GET("/download_file", doc.DownloadFile)
		loginGroup.POST("/del", doc.Del)
	}
}
