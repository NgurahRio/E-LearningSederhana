package students

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func GetStudentCourses(c *gin.Context) {
	uid := c.GetUint("userID")

	var scs []models.StudentCourse
	if err := db.DB.Where("student_id = ?", uid).Find(&scs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch"})
		return
	}

	courseIDs := make([]uint, 0, len(scs))
	for _, sc := range scs {
		courseIDs = append(courseIDs, sc.CourseID)
	}

	var courses []models.Course
	if len(courseIDs) > 0 {
		if err := db.DB.Preload("Teacher").Find(&courses, courseIDs).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch courses"})
			return
		}
	}

	c.JSON(http.StatusOK, courses)
}
