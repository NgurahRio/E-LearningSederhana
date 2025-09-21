package teachers

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

type CourseListResp struct {
	IDCourse    uint   `json:"id_course"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Teacher     struct {
		IDUser   uint   `json:"id_user"`
		Name     string `json:"name"`
		Email    string `json:"email"`
		RoleName string `json:"role"`
	} `json:"teacher"`
}

func GetMyCourses(c *gin.Context) {
	uid := c.GetUint("userID")

	var courses []models.Course

	if err := db.DB.Preload("Teacher.Role").
		Where("teacher_id = ?", uid).
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
		return
	}

	var resp []CourseListResp
	for _, course := range courses {
		cr := CourseListResp{
			IDCourse:    course.IDCourse,
			Title:       course.Title,
			Description: course.Description,
		}
		cr.Teacher.IDUser = course.Teacher.IDUser
		cr.Teacher.Name = course.Teacher.Name
		cr.Teacher.Email = course.Teacher.Email
		cr.Teacher.RoleName = course.Teacher.Role.RoleName
		resp = append(resp, cr)
	}

	c.JSON(http.StatusOK, resp)
}
