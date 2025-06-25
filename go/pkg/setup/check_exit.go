package setup

import "os"

func checkExit(path string) bool {
	_, err := os.Stat(path)
	return err == nil || !os.IsNotExist(err)
}
