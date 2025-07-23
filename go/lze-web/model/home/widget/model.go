package widget

type Rec struct {
	User string `json:"user"`
}
type PicMes struct {
	Name  string `json:"name"`
	Media string `json:"media"`
}
type Send struct {
	Doc []string  `json:"doc"`
	Pic [1]PicMes `json:"pic"`
	Tra []string  `json:"tra"`
	Mon [3]string `json:"mon"`
	Not []string  `json:"not"`
	Bok []string  `json:"bok"`
}
