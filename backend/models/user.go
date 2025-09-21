package models

type User struct {
	IDUser   uint   `gorm:"primaryKey;column:id_user" json:"id_user"`
	Name     string `gorm:"type:varchar(100);not null" json:"name"`
	Email    string `gorm:"type:varchar(100);unique;not null" json:"email"`
	Password string `gorm:"type:varchar(255);not null" json:"-"`
	RoleID   uint   `gorm:"column:role_id;not null" json:"role_id"`

	Role    Role     `gorm:"foreignKey:RoleID;references:IDRole" json:"role"`
	Courses []Course `gorm:"foreignKey:TeacherID;references:IDUser" json:"-"`
}
