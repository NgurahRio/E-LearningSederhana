package users

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

func GetUserList(c *gin.Context) {
	var users []models.User
	if err := db.DB.Preload("Role").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	var response []gin.H
	for _, u := range users {
		response = append(response, gin.H{
			"id":      u.IDUser,
			"name":    u.Name,
			"email":   u.Email,
			"role_id": u.RoleID,
			"role":    u.Role.RoleName,
		})
	}

	c.JSON(http.StatusOK, gin.H{"users": response})
}
