package teachers

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

type CourseUpdateResp struct {
	IDCourse    uint   `json:"id_course"`
	TeacherName string `json:"teacher_name"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func PutCourse(c *gin.Context) {
	uid := c.GetUint("userID")
	id := c.Param("id")

	var course models.Course
	if err := db.DB.First(&course, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "course not found"})
		return
	}
	if course.TeacherID != uid {
		c.JSON(http.StatusForbidden, gin.H{"error": "not your course"})
		return
	}

	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Title != "" {
		course.Title = req.Title
	}
	if req.Description != "" {
		course.Description = req.Description
	}

	if err := db.DB.Save(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update"})
		return
	}

	db.DB.Preload("Teacher").First(&course, course.IDCourse)

	resp := CourseUpdateResp{
		IDCourse:    course.IDCourse,
		TeacherName: course.Teacher.Name,
		Title:       course.Title,
		Description: course.Description,
	}

	c.JSON(http.StatusOK, resp)
}
