package rename

type Rec struct {
	User    string `json:"user"`
	Token   string `json:"token"`
	OldPath string `json:"oldpath"`
	NewPath string `json:"newpath"`
}
