package recover

type Rec struct {
	User        string   `json:"user"`
	Token       string   `json:"token"`
	RecoverList []string `json:"recover_list"`
	SourcePath  bool     `json:"source_path"`
}
