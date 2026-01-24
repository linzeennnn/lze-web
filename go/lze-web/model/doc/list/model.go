package list

type Rec struct {
	File string `json:"file"`
}
type SendDir struct {
	FileType      string      `json:"type"`
	Meta          [2]string   `json:"meta"`
	FileList      [][2]string `json:"filelist"`
	CurrentFolder string      `json:"currentFolder"`
	ParentFolder  string      `json:"parentFolder"`
}
type SendFile struct {
	FileType string   `json:"type"`
	Url      string   `json:"url"`
	InnerApp []string `json:"innerApp"`
}
