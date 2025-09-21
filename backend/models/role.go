package models

type Role struct {
	IDRole   uint   `gorm:"primaryKey;column:id_role" json:"id_role"`
	RoleName string `gorm:"type:varchar(50);unique;not null" json:"role_name"`
}

func (Role) TableName() string {
	return "roles"
}
