package mon

import (
	updateact "lze-web/model/mon/update_act"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func UpdateAct(c *gin.Context) {
	var rec updateact.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "mon", "change") {
		switch rec.Change {
		case "add":
			add(rec.Name, rec.Control, rec.Action)
		case "remove":
			remove(rec.Name, rec.Control, rec.Action)
		}
	} else {
		c.Status(401)
	}
}
func getModule(control, action string) ([]interface{}, map[string]interface{}) {
	controlModule := global.UserConfig["control"].(map[string]interface{})
	controlConfig := controlModule[control].(map[string]interface{})
	actionModule := controlConfig["action"].(map[string]interface{})
	actionMes := actionModule[action].(map[string]interface{})
	actionUser := actionMes["user"].([]interface{})
	return actionUser, actionMes
}
func remove(username, control, action string) {
	userList, actionMes := getModule(control, action)
	newList := make([]interface{}, 0)
	for _, v := range userList {
		if v.(string) != username {
			newList = append(newList, v)
		}
	}
	actionMes["user"] = newList
	global.SaveUserConfig()
}
func add(username, control, action string) {
	userList, actionMes := getModule(control, action)
	for _, v := range userList {
		if v.(string) == username {
			return
		}
	}
	userList = append(userList, username)
	actionMes["user"] = userList
	global.SaveUserConfig()
}
