package edit

type Rec struct {
	OldTitle   string `json:"oldTitle"`
	NewTitle   string `json:"newTitle"`
	NewContent string `json:"newContent"`
	Source     string `json:"source"`
	Path       string `json:"path"`
}
