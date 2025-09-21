package students

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func GetAllCourses(c *gin.Context) {
	var courses []models.Course

	if err := db.DB.Preload("Teacher").Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch courses"})
		return
	}

	c.JSON(http.StatusOK, courses)
}
