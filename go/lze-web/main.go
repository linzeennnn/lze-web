package main

import (
	global "lze-web/pkg/global"
	"lze-web/pkg/setup"
	"lze-web/router"
)

func main() {
	setup.CheckConfig()
	setup.Setup()
	setup.CheckFilePath()
	r := router.Router()
	r.Run(":" + global.Port)
}
