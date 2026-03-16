package list

type Rec struct {
	Folder string `json:"folder"`
}
type Send struct {
	Meta          [2]string   `json:"meta"`
	FileList      [][2]string `json:"filelist"`
	CurrentFolder string      `json:"currentFolder"`
	ParentFolder  string      `json:"parentFolder"`
}
