package main

import (
	"log"
	"os"

	"backend/db"
	"backend/middleware"
	"backend/routes/students"
	"backend/routes/teachers"
	"backend/routes/users"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.Connect()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	public := r.Group("/api")
	{
		public.POST("/users/register", users.PostUser)
		public.POST("/users/login", users.PostLogin)
	}

	// Protected routes
	auth := r.Group("/api", middleware.JWTAuth())

	{
		auth.GET("/users", middleware.RequireRoles("admin"), users.GetUserList)
		auth.PUT("/users/:id", middleware.RequireRoles("admin"), users.PutUser)
		auth.DELETE("/users/:id", middleware.RequireRoles("admin"), users.DeleteUser)

		stu := auth.Group("/students", middleware.RequireRoles("student"))
		{
			stu.GET("/my-courses", students.GetStudentCourses)
			stu.POST("/enroll", students.PostEnroll)
			stu.GET("/all-courses", students.GetAllCourses)
			stu.GET("/available-courses", students.GetAvailableCourses)

		}

		tch := auth.Group("/teachers", middleware.RequireRoles("teacher"))
		{
			tch.GET("/my-courses", teachers.GetMyCourses)
			tch.POST("/course", teachers.PostCourse)
			tch.PUT("/course/:id", teachers.PutCourse)
			tch.DELETE("/course/:id", teachers.DeleteCourse)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("✅ Server running on :" + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
