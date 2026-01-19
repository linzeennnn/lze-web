package router

import (
	"lze-web/service/lang"

	"github.com/gin-gonic/gin"
)

func RouterLang(r *gin.Engine) {

	r.POST("/api/lang", lang.GetLang)

}
