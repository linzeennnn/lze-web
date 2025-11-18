package plugin

import (
	"bytes"
	"lze-web/pkg/global"
	"os/exec"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetRun(c *gin.Context) {
	Run(c, false)
}
func PostRun(c *gin.Context) {
	Run(c, true)
}
func Run(c *gin.Context, havePara bool) {
	var paraList []string
	if havePara {
		if err := c.ShouldBindJSON(&paraList); err != nil {
			c.JSON(400, err)
			return
		}
	}
	pluginName := c.Param("path")
	pluginName = strings.ReplaceAll(pluginName, "/", "")
	cmdConfig := global.ReadText(global.CmdPath)
	cmdData := global.JsonToMap(cmdConfig)
	if pluginJson, ok := cmdData[pluginName]; ok {
		pluginMap := pluginJson.(map[string]interface{})
		isAuth := pluginMap["auth"].(bool)
		if isAuth && !auth(c) {
			c.Status(401)
		} else {
			cmdStr := pluginMap["cmd"].(string)
			for _, para := range paraList {
				cmdStr += " " + para
			}
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

	global.InitUserMes(c)
	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	if curUserMes.Name == "admin" {
		if global.CheckToken(c) {
			return true
		} else {
			return false
		}
	} else {
		return false
	}
}
