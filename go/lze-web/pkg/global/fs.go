// 判断是否为文本
func IsText(path string) bool {
	ext := strings.ToLower(filepath.Ext(path))
	if global.TextMap[ext] {
		return true
	}
	return IsTextFast(path)
}
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

// 判断是否为图片
func IsImg(path string) bool {
	return global.ImgMap[strings.ToLower(filepath.Ext(path))]
}

// 判断是否视频
func IsVid(path string) bool {
	return global.VidMap[strings.ToLower(filepath.Ext(path))]
}

// 判断是否为浏览器支持类型
func IsWebType(path string) bool {
	return global.WebTypeMap[strings.ToLower(filepath.Ext(path))]
}