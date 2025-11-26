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
	cmdObj := getCmdStr(pluginName)
	if cmdObj.CmdStr != "" {
		if cmdObj.IsAuth && !auth(c) {
			c.Status(401)
		} else {
			cmdStr := cmdObj.CmdStr
			for _, para := range paraList {
				cmdStr += " " + para
			}
			c.String(200, cmdRun(cmdStr))
		}

	} else {
		c.Status(404)
	}
}

// 从缓存获取命令字符串或者从配置文件获取命令字符串
func getCmdStr(cmdName string) *global.CmdObj {
	// 1. 先从缓存读取
	if cmdObj, ok := global.CmdCacheMap.CmdMap[cmdName]; ok {
		cmdObj.Time = global.GetTimeStampS()
		return cmdObj
	}

	// 2. 缓存没有命中，读取 JSON
	cmdConfig := global.ReadText(global.CmdPath)
	cmdData := global.JsonToMap(cmdConfig)

	if pluginJson, ok := cmdData[cmdName]; ok {
		pluginMap := pluginJson.(map[string]interface{})
		cmdStr := pluginMap["cmd"].(string)
		isAuth := pluginMap["auth"].(bool)

		// 正确分配内存
		cmdObj := &global.CmdObj{
			CmdStr: cmdStr,
			IsAuth: isAuth,
		}
		cmdObj.Time = global.GetTimeStampS()
		updateCache(cmdName, cmdObj)
		return cmdObj
	}

	// 3. 没找到，返回空对象
	return &global.CmdObj{}
}

// 更新缓存
func updateCache(cmdName string, cmdObj *global.CmdObj) {
	cc := global.CmdCacheMap
	// 1. 前 10 条，依次使用 dummy1~dummy10
	if cc.DummyIndex <= cc.MaxDummy {
		key := fmt.Sprintf("dummy%d", cc.DummyIndex)
		cc.CmdMap[key] = cmdObj
		cc.OldestCmd = key
		cc.DummyIndex++
		return
	}
	// 2. 超过 MaxDummy，替换 Time 最老的条目
	oldTime := int64(^uint64(0) >> 1) // 最大 int64
	oldKey := ""
	for k, v := range cc.CmdMap {
		if v.Time < oldTime {
			oldTime = v.Time
			oldKey = k
		}
	}
	if oldKey != "" {
		// 删除最老的 key
		delete(cc.CmdMap, oldKey)
		// 添加新的 cmdName
		cc.CmdMap[cmdName] = cmdObj
		// 更新 OldestCmd 为新插入的 cmdName
		cc.OldestCmd = cmdName
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
