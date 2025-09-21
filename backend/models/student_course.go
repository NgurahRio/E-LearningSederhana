package models

type StudentCourse struct {
	IDStudentCourse uint `gorm:"primaryKey;column:id_student_course"`
	StudentID       uint `gorm:"not null;column:student_id"`
	CourseID        uint `gorm:"not null;column:course_id"`

	Student User   `gorm:"foreignKey:StudentID;references:IDUser"`
	Course  Course `gorm:"foreignKey:CourseID;references:IDCourse"`
}

func (StudentCourse) TableName() string {
	return "student_courses"
}
