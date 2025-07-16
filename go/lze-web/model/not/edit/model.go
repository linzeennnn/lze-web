package edit

type Rec struct {
	OldTitle   string `json:"oldTitle"`
	NewTitle   string `json:"newTitle"`
	User       string `json:"user"`
	Token      string `json:"token"`
	NewContent string `json:"newContent"`
}
