package teachers

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func DeleteCourse(c *gin.Context) {
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

	if err := db.DB.Delete(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Pelajaran berhasil dihapus"})
}
