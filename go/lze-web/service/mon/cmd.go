package mon

import (
	"bytes"
	"lze-web/model/mon/cmd"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os/exec"
	"regexp"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
)

func Cmd(c *gin.Context) {
	var rec cmd.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	if curUserMes.Name == "admin" {
		if global.CheckToken(c) {
			sendData.Code = 200
			sendData.Data = cmdRun(rec.CmdStr)
			c.JSON(sendData.Code, sendData)
		} else {
			sendData.Code = 401
			sendData.Msg = global.GetText("login_outdate", c)
			c.JSON(sendData.Code, sendData)
		}
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_cmd_per", c)
		c.JSON(sendData.Code, sendData)
	}

}
func cmdRun(command string) string {
	if isDangerous(command) {
		return "this command is not allowed"
	}

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

func isDangerous(cmd string) bool {
	// 统一小写
	c := strings.ToLower(cmd)

	// 匹配黑名单命令
	dangerous := []string{
		"rm", "del", "rmdir", "mv", "cp", "dd",
		"curl", "wget", "ssh",
	}

	for _, d := range dangerous {
		if strings.Contains(c, d) {
			return true
		}
	}

	re := regexp.MustCompile(`[;|&>]{1,2}`)
	return re.MatchString(c)
}
