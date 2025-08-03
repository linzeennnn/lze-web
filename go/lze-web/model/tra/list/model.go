package list

type Rec struct {
	Folder string `json:"folder"`
}
type Send struct {
	Meta          [3]string   `json:"meta"`
	FileList      [][3]string `json:"filelist"`
	CurrentFolder string      `json:"currentFolder"`
	ParentFolder  string      `json:"parentFolder"`
}
