package widget

type Rec struct {
	User string `json:"user"`
}
type Send struct {
	Doc1  string `json:"doc1"`
	Doc2  string `json:"doc2"`
	Doc3  string `json:"doc3"`
	Not1  string `json:"not1"`
	Not2  string `json:"not2"`
	Not3  string `json:"not3"`
	Bok1  string `json:"bok1"`
	Pic1  string `json:"pic1"`
	Tra1  string `json:"tra1"`
	Mon1  string `json:"mon1"`
	Mon2  int    `json:"mon2"`
	Mon3  int    `json:"mon3"`
	Used  uint64 `json:"used"`
	Total uint64 `json:"total"`
}
