package global

import (
	"encoding/json"
	"path/filepath"
)

func GetDeldata() map[string]interface{} {
	delData := ReadText(filepath.Join(WorkDir, "config", "del_data.json"))
	return JsonToMap(delData)
}
func SaveDelData(delData map[string]interface{}) {

	userJson, err := json.MarshalIndent(delData, "", "  ")
	if err != nil {
		panic(err)
	}
	WriteText(filepath.Join(WorkDir, "config", "del_data.json"), string(userJson))

}
func CleanDelData() {
	WriteText(filepath.Join(WorkDir, "config", "del_data.json"), "{}")
}
