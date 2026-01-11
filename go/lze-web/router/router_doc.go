package router

import (
	"lze-web/service/doc"

	"github.com/gin-gonic/gin"
)

func RouterDoc(r *gin.Engine) {
	loginGroup := r.Group("/api/doc")
	{
		loginGroup.POST("/list", doc.List)
		loginGroup.POST("/upload_file", doc.UploadFile)
		loginGroup.POST("/upload_folder", doc.UploadFolder)
		loginGroup.POST("/move_folder", doc.MoveFolder)
		loginGroup.POST("/new_folder", doc.NewFolder)
		loginGroup.POST("/copy", doc.Copy)
		loginGroup.POST("/move", doc.Move)
		loginGroup.PATCH("/rename", doc.Rename)
		loginGroup.DELETE("/del", doc.Del)
		loginGroup.POST("/link", doc.Link)
		loginGroup.POST("/download_folder", doc.PostDownloadDir)
		loginGroup.GET("/download_folder/*filepath", doc.GetDownLoadDir)
		loginGroup.POST("/download_file", doc.PostDownloadFile)
		loginGroup.GET("/download_file/*filepath", doc.GetDownLoadFile)
	}
}
