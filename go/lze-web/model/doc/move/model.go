package move

type Rec struct {
	NowPath  string   `json:"nowpath"`
	CopyList []string `json:"copylist"`
	Source   string   `json:"source"`
}
