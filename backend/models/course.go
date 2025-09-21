package models

type Course struct {
	IDCourse    uint   `gorm:"primaryKey;column:id_course" json:"id_course"`
	Title       string `gorm:"type:varchar(150);not null" json:"title"`
	Description string `gorm:"type:text" json:"description"`
	TeacherID   uint   `gorm:"not null" json:"teacher_id"`

	Teacher User `gorm:"foreignKey:TeacherID;references:IDUser" json:"teacher"`
}
