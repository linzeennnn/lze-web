package copyDoc

type Rec struct {
	User     string   `json:"user"`
	Token    string   `json:"token"`
	NowPath  string   `json:"nowpath"`
	CopyList []string `json:"copylist"`
}
