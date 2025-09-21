package teachers

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

type courseReq struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

type courseResp struct {
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

func PostCourse(c *gin.Context) {
	uid := c.GetUint("userID")

	var req courseReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	course := models.Course{
		Title:       req.Title,
		Description: req.Description,
		TeacherID:   uid,
	}

	if err := db.DB.Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create"})
		return
	}

	db.DB.Preload("Teacher.Role").First(&course, course.IDCourse)

	resp := courseResp{
		IDCourse:    course.IDCourse,
		Title:       course.Title,
		Description: course.Description,
	}
	resp.Teacher.IDUser = course.Teacher.IDUser
	resp.Teacher.Name = course.Teacher.Name
	resp.Teacher.Email = course.Teacher.Email
	resp.Teacher.RoleName = course.Teacher.Role.RoleName

	c.JSON(http.StatusCreated, resp)
}
