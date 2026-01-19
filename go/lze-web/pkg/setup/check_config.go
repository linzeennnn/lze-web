package setup

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
)

//go:embed work_config.json
var defaultWorkConfig string

//go:embed user_config.json
var defaultUserConfig string

//go:embed cmd_config.json
var defaultCmdConfig string

func CheckConfig() {
	ConfigPath := filepath.Join(global.GetWorkDir(), "config")
	userConfigPath := filepath.Join(ConfigPath, "user_config.json")
	workConfigPath := filepath.Join(ConfigPath, "work_config.json")
	cmdConfigPath := filepath.Join(ConfigPath, "cmd_config.json")
	delDataPath := filepath.Join(ConfigPath, "del_data.json")

	// 创建目录
	if !checkExit(ConfigPath) {
		if err := os.MkdirAll(ConfigPath, 0755); err != nil {
			panic(err)
		}
	}

	// 处理 user_config.json
	if !checkExit(userConfigPath) {
		// 文件不存在直接写入默认配置
		global.WriteText(userConfigPath, defaultUserConfig)
	} else {
		// 文件存在，检查字段并合并
		mergeUserConfig(userConfigPath, defaultUserConfig)
	}

	// 其他配置文件
	if !checkExit(workConfigPath) {
		global.WriteText(workConfigPath, defaultWorkConfig)
	}
	if !checkExit(cmdConfigPath) {
		global.WriteText(cmdConfigPath, defaultCmdConfig)
	}
	if !checkExit(delDataPath) {
		global.WriteText(delDataPath, "{}")
	}
}

// mergeUserConfig 合并默认配置到已有配置（仅添加缺失字段）
func mergeUserConfig(userConfigPath string, defaultConfig string) {
	// 读取现有配置
	userText := global.ReadText(userConfigPath)

	var userCfg map[string]interface{}
	if err := json.Unmarshal([]byte(userText), &userCfg); err != nil {
		fmt.Println("解析 user_config.json 失败，使用默认配置覆盖:", err)
		global.WriteText(userConfigPath, defaultConfig)
		return
	}

	var defaultCfg map[string]interface{}
	if err := json.Unmarshal([]byte(defaultConfig), &defaultCfg); err != nil {
		panic("解析 defaultUserConfig 失败: " + err.Error())
	}

	// 递归合并
	merged := mergeMaps(defaultCfg, userCfg)

	// 写回文件
	data, err := json.MarshalIndent(merged, "", "  ")
	if err != nil {
		panic(err)
	}
	global.WriteText(userConfigPath, string(data))
}

// mergeMaps 将 defaultMap 的缺失字段补充到 userMap
func mergeMaps(defaultMap, userMap map[string]interface{}) map[string]interface{} {
	for k, v := range defaultMap {
		if uv, ok := userMap[k]; ok {
			// 如果当前字段是 map，递归合并
			vMap, vIsMap := v.(map[string]interface{})
			uvMap, uvIsMap := uv.(map[string]interface{})
			if vIsMap && uvIsMap {
				userMap[k] = mergeMaps(vMap, uvMap)
			}
			// 如果是数组或其他类型，保持 userMap 原有值
		} else {
			// 字段不存在，直接加上
			userMap[k] = v
		}
	}
	return userMap
}
