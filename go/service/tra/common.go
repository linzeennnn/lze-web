package tra

import (
	"lze-web/pkg/global"
	"path/filepath"
)

func getDeldata() map[string]interface{} {
	delData := global.ReadText(filepath.Join(global.WorkDir, "config", "del_data.json"))
	return global.JsonToMap(delData)
}
