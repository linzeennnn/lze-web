package modPas

type UserMes struct {
	NewPas string `json:"newPas"`
	OldPas string `json:"oldPas"`
}
type Rec struct {
	UserMes string `json:"userMes"`
}
type Send struct {
	Token string `json:"token"`
}
