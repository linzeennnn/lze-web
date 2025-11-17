package config

type UserMes struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	Jti      string `json:"jti"`
	Exp      int64  `json:"exp"`
	Outdate  string `json:"outdate"`
}
