package widget

type Rec struct {
	User string `json:"user"`
}
type Send struct {
	Doc []string  `json:"doc"`
	Pic []string  `json:"pic"`
	Tra []string  `json:"tra"`
	Mon [3]string `json:"mon"`
	Not []string  `json:"not"`
	Bok []string  `json:"bok"`
}
