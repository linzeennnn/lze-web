package mon

import (
	"bytes"
	"lze-web/model/mon/cmd"
	"lze-web/pkg/global"
	"os/exec"
	"regexp"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
)

func Cmd(c *gin.Context) {
	var rec cmd.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
	}

	authHeader := c.GetHeader("authorization")
	var token string
	if strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	} else {
		token = authHeader
	}
	if global.CheckToken("admin", token) {
		c.String(200, cmdRun(rec.CmdStr))
	} else {
		c.Status(401)
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
