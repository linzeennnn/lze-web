package list

type Rec struct {
	Folder string `json:"folder"`
}
type FileList struct {
	Name  string `json:"name"`
	Type  string `json:"type"`
	Media string `json:"media"`
}
type Send struct {
	FileList      []FileList `json:"filelist"`
	CurrentFolder string     `json:"currentFolder"`
	ParentFolder  string     `json:"parentFolder"`
}
