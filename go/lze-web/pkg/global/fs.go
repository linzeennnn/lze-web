package global

import (
	"os"
	"unicode/utf8"
)

func IsTextFast(path string) bool { // 快速判断是否为文本
	f, err := os.Open(path)
	if err != nil {
		return false
	}
	defer f.Close()

	buf := make([]byte, 16)
	n, _ := f.Read(buf)
	buf = buf[:n]

	for _, b := range buf {
		if b == 0 {
			return false
		}
	}
	return true
}
func IsTextDeep(p string) bool { // 深度判断是否为文本
	f, e := os.Open(p)
	if e != nil {
		return false
	}
	defer f.Close()
	b := make([]byte, 4096)
	n, e := f.Read(b)
	if e != nil || n == 0 {
		return false
	}
	b = b[:n]
	for _, c := range b {
		if c == 0 {
			return false
		}
	}

	return utf8.Valid(b)
}
