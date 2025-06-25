package setup

import (
	_ "embed"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
)

//go:embed work_config.json
var defaultWorkConfig string

//go:embed user_config.json
var defaultUserConfig string

func CheckConfig() {
	ConfigPath := filepath.Join(global.GetWorkDir(), "config")
	userConfigPath := filepath.Join(ConfigPath, "user_config.json")
	workConfigPath := filepath.Join(ConfigPath, "work_config.json")
	delDataPath := filepath.Join(ConfigPath, "del_data.json")
	if !checkExit(ConfigPath) {
		os.MkdirAll(ConfigPath, 0755)
	}
	if !checkExit(userConfigPath) {
		global.WriteText(userConfigPath, defaultUserConfig)
	}
	if !checkExit(workConfigPath) {
		global.WriteText(workConfigPath, defaultWorkConfig)
	}
	if !checkExit(delDataPath) {
		global.WriteText(delDataPath, "{}")
	}
}
