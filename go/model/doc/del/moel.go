package del

type Rec struct {
	User    string   `json:"user"`
	Token   string   `json:"token"`
	DelList []string `json:"dellist"`
}
