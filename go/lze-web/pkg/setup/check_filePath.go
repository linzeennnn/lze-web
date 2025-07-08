package setup

import (
	"lze-web/pkg/global"
	"os"
)

func CheckFilePath() {
	checkAndCreat(global.FilePath)
	checkAndCreat(global.DocPath)
	checkAndCreat(global.PicPath)
	checkAndCreat(global.NotPath)
	checkAndCreat(global.BokPath)
	checkAndCreat(global.TraPath)
	checkAndCreat(global.TempPath)
}
func checkAndCreat(path string) {
	if !checkExit(path) {
		os.MkdirAll(path, os.ModePerm)
	}
}
