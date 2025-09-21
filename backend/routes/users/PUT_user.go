package users

import (
	"net/http"

	"backend/db"
	"backend/models"

	"github.com/gin-gonic/gin"
)

type updateUserReq struct {
	Name   *string `json:"name"`
	Email  *string `json:"email"`
	RoleID *uint   `json:"role_id"`
}

func PutUser(c *gin.Context) {
	id := c.Param("id")

	var user models.User
	if err := db.DB.First(&user, "id_user = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	var req updateUserReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := make(map[string]interface{})
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Email != nil {
		updates["email"] = *req.Email
	}
	if req.RoleID != nil {
		updates["role_id"] = *req.RoleID
	}

	if len(updates) > 0 {
		if err := db.DB.Model(&models.User{}).
			Where("id_user = ?", id).
			Updates(updates).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update user"})
			return
		}
	}

	db.DB.Preload("Role").First(&user, "id_user = ?", id)

	c.JSON(http.StatusOK, gin.H{
		"id":      user.IDUser,
		"name":    user.Name,
		"email":   user.Email,
		"role_id": user.RoleID,
		"role":    user.Role.RoleName,
	})
}
