package copyDoc

type Rec struct {
	NowPath  string   `json:"nowpath"`
	CopyList []string `json:"copylist"`
	Source   string   `json:"source"`
}
type Send struct {
	FileList [][2]string `json:"fileList"`
}
