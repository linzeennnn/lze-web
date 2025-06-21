package main

import (
	global "lze-web/pkg/global"
	"lze-web/pkg/setup"
	"lze-web/router"
)

func main() {
	setup.Setup()
	r := router.Router()
	r.Run(":" + global.Port)
}
