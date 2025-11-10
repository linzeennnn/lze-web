package plugin

import (
	"bytes"
	"fmt"
	"lze-web/pkg/global"
	"os/exec"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
)

func Run(c *gin.Context) {
	pluginName := c.Param("path")
	pluginName = strings.ReplaceAll(pluginName, "/", "")
	cmdConfig := global.ReadText(global.CmdPath)
	cmdData := global.JsonToMap(cmdConfig)
	fmt.Println(pluginName)
	if pluginJson, ok := cmdData[pluginName]; ok {
		pluginMap := pluginJson.(map[string]interface{})
		isAuth := pluginMap["auth"].(bool)
		if isAuth && !auth(c) {
			c.Status(401)
		} else {
			cmdStr := pluginMap["cmd"].(string)
			c.String(200, cmdRun(cmdStr))
		}

	} else {
		c.Status(404)
	}
}
func cmdRun(command string) string {
	var execCmd *exec.Cmd
	if runtime.GOOS == "windows" {
		execCmd = exec.Command("cmd", "/C", command)
	} else {
		execCmd = exec.Command("sh", "-c", command)
	}

	var out, stderr bytes.Buffer
	execCmd.Stdout = &out
	execCmd.Stderr = &stderr

	err := execCmd.Run()
	if err != nil {
		if stderr.Len() > 0 {
			return stderr.String()
		}
		return err.Error()
	}
	return out.String()
}

func auth(c *gin.Context) bool {

	authHeader := c.GetHeader("authorization")
	var token string
	if strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	} else {
		token = authHeader
	}
	if global.CheckToken("admin", token) {
		return true
	} else {
		return false
	}
}
