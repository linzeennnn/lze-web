package doclist

type Rec struct {
	Name string `json:"name"`
}

type Send struct {
	Filetype string   `json:"type"`
	List     []string `json:"list"`
}
